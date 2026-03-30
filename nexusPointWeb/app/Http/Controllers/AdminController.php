<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class AdminController extends Controller
{
    private function apiUrl(): string
    {
        return rtrim(env('NEXUSPOINT_API_URL', 'https://nexuspoint-api.onrender.com'), '/');
    }

    private function token(): string
    {
        return Session::get('api_token', '');
    }

        // ─── DASHBOARD ─────────────────────────────────────────────
    public function dashboard()
    {
        $headers = ['Authorization' => "Bearer {$this->token()}"];

        // ─── 1. Datos base
        $reservaciones = Http::withHeaders($headers)->get($this->apiUrl() . '/reservaciones/')->json() ?? [];
        $espacios      = Http::withHeaders($headers)->get($this->apiUrl() . '/espacios/')->json() ?? [];

        // ─── 2. Edificios desde el catálogo correcto
        $edificios = Http::withHeaders($headers)
                        ->get($this->apiUrl() . '/espacios/catalogos/edificios')
                        ->json() ?? [];

        // ─── 3. Construir mapas relacionales
        //        id_piso => id_edificio  /  id_edificio => nombre_edificio
        $mapPisos     = [];
        $mapEdificios = [];

        foreach ($edificios as $edificio) {
            $idEdificio     = $edificio['id_edificio'];
            $nombreEdificio = $edificio['nombre_edificio'];

            $mapEdificios[$idEdificio] = $nombreEdificio;

            // Pedir los pisos de cada edificio
            $pisos = Http::withHeaders($headers)
                         ->get($this->apiUrl() . "/espacios/catalogos/pisos/{$idEdificio}")
                         ->json() ?? [];

            foreach ($pisos as $piso) {
                $mapPisos[$piso['id_piso']] = $idEdificio;
            }
        }

        // ─── 4. Mapa: id_espacio => id_piso
        $mapEspacioPiso = [];
        foreach ($espacios as $espacio) {
            $idEspacio = $espacio['id_espacio'] ?? null;
            $idPiso    = $espacio['id_piso']    ?? null;

            // Si la API devuelve el piso como objeto anidado
            if (is_array($idPiso)) {
                $idPiso = $idPiso['id_piso'] ?? null;
            }

            if ($idEspacio && $idPiso) {
                $mapEspacioPiso[$idEspacio] = $idPiso;
            }
        }

        // ─── 5. Stats
        $totalReservaciones = count($reservaciones);

        $espaciosActivos = count(array_filter($espacios, function ($e) {
            return ($e['id_estado'] ?? $e['id_estado_espacio'] ?? 0) == 1;
        }));

        $aprobadas = count(array_filter($reservaciones, function ($r) {
            return ($r['id_estado_reservacion'] ?? 0) == 2;
        }));

        $tasaAprobacion = $totalReservaciones > 0
            ? round(($aprobadas / $totalReservaciones) * 100)
            : 0;

        // ─── 6. Reservaciones por día de la semana (usa fecha_solicitud)
        $dias = ['Lun' => 0, 'Mar' => 0, 'Mié' => 0, 'Jue' => 0, 'Vie' => 0, 'Sáb' => 0, 'Dom' => 0];

        $mapaDias = [
            'Monday'    => 'Lun',
            'Tuesday'   => 'Mar',
            'Wednesday' => 'Mié',
            'Thursday'  => 'Jue',
            'Friday'    => 'Vie',
            'Saturday'  => 'Sáb',
            'Sunday'    => 'Dom',
        ];

        foreach ($reservaciones as $r) {
            $fecha = $r['fecha_solicitud'] ?? null;
            if ($fecha) {
                $dia   = date('l', strtotime($fecha));
                $corto = $mapaDias[$dia] ?? null;
                if ($corto) {
                    $dias[$corto]++;
                }
            }
        }

        // ─── 7. Gráfica de pie: reservaciones por edificio
        //        Fallback: espacios por edificio si no hay reservaciones
        $graficaEdificios = [];

        if ($totalReservaciones > 0) {
            foreach ($reservaciones as $r) {
                $idEspacio      = $r['id_espacio'] ?? null;
                $idPiso         = $mapEspacioPiso[$idEspacio] ?? null;
                $idEdificio     = $mapPisos[$idPiso] ?? null;
                $nombreEdificio = $mapEdificios[$idEdificio] ?? null;

                if ($nombreEdificio) {
                    $graficaEdificios[$nombreEdificio] = ($graficaEdificios[$nombreEdificio] ?? 0) + 1;
                }
            }
        } else {
            foreach ($espacios as $e) {
                $idPiso = $e['id_piso'] ?? null;
                if (is_array($idPiso)) {
                    $idPiso = $idPiso['id_piso'] ?? null;
                }
                $idEdificio     = $mapPisos[$idPiso] ?? null;
                $nombreEdificio = $mapEdificios[$idEdificio] ?? null;

                if ($nombreEdificio) {
                    $graficaEdificios[$nombreEdificio] = ($graficaEdificios[$nombreEdificio] ?? 0) + 1;
                }
            }
        }

        return view('admin.dashboard', [
            'userData'           => Session::get('user_data', []),
            'totalSolicitudes'   => $totalReservaciones,
            'espaciosActivos'    => $espaciosActivos,
            'tasaAprobacion'     => $tasaAprobacion,
            'diasSemana'         => $dias,
            'ocupacionEdificios' => $graficaEdificios,
        ]);
    }

    // ─── SOLICITUDES / RESERVACIONES ──────────────────────────
    public function solicitudes()
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->get($this->apiUrl() . '/reservaciones/');

        $solicitudes = $res->successful() ? $res->json() : [];

        return view('admin.solicitudes', [
            'userData'    => Session::get('user_data', []),
            'solicitudes' => $solicitudes,
        ]);
    }

    public function actualizarSolicitud(Request $request, $id)
    {
        // Usa el endpoint POST /reservaciones/gestionar
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->post($this->apiUrl() . '/reservaciones/gestionar', [
                       'id_reservacion'        => (int) $id,
                       'id_estado_reservacion' => $request->input('id_estado_reservacion'),
                       'observaciones'         => $request->input('observaciones', ''),
                   ]);

        return response()->json([
            'success' => $res->successful(),
            'message' => $res->json()['detail'] ?? null,
        ], $res->successful() ? 200 : 422);
    }

    // ─── ESPACIOS ─────────────────────────────────────────────────────────────
    public function espacios()
    {
        $token = $this->token();
        $headers = ['Authorization' => "Bearer {$token}"];

        // 1. Obtener espacios desde la API de Render
        $resEspacios = Http::withHeaders($headers)->get($this->apiUrl() . '/espacios');
        $espaciosRaw = $resEspacios->successful() ? $resEspacios->json() : [];

        // 2. Mapear los datos para que coincidan con lo que espera tu Blade
        $espacios = collect($espaciosRaw)->map(function ($e) {
            return [
                'id_espacio' => $e['id_espacio'],
                'nombre'     => $e['nombre_espacio'], // Transformamos nombre_espacio a nombre
                'capacidad'  => $e['capacidad'],
                'tipo'       => $this->mapTipoEspacio($e['id_tipo_espacio']), // Convertimos ID a Texto
                'estatus'    => $this->mapEstadoEspacio($e['id_estado_espacio']), // Convertimos ID a Texto
                'edificio'   => $this->mapEdificio($e['id_piso']), // Usamos id_piso como referencia de edificio según tu captura
            ];
        });

        return view('admin.espacios', [
            'userData' => Session::get('user_data', []),
            'espacios' => $espacios,
        ]);
    }
    public function espaciosCreate()
    {
        return view('admin.espacios-form', [
            'userData' => Session::get('user_data', []),
            'espacio'  => null,
        ]);
    }

    public function espaciosEdit($id)
    {
        $token = $this->token();
        $headers = ['Authorization' => "Bearer {$token}"];

        // 1. Datos del espacio
        $res = Http::withHeaders($headers)->get($this->apiUrl() . "/espacios/{$id}");
        if (!$res->successful()) return redirect()->route('admin.espacios')->with('error', 'Espacio no encontrado');
        
        $data = $res->json();
        $espacio = [
            'id'                => $data['id_espacio'],
            'nombre'            => $data['nombre_espacio'] ?? '',
            'capacidad'         => $data['capacidad'] ?? 0,
            'id_tipo_espacio'   => $data['id_tipo_espacio'] ?? 1,
            'id_estado_espacio' => $data['id_estado_espacio'] ?? 1,
            'id_piso'           => $data['id_piso'] ?? 1,
        ];

        // 2. Equipamiento actual (Si falla, enviamos array vacío)
        $resEquipos = Http::withHeaders($headers)->get($this->apiUrl() . "/espacios/{$id}/equipamiento");
        $idsAsignados = $resEquipos->successful() ? collect($resEquipos->json())->pluck('id_equipamiento')->toArray() : [];

        // 3. CATÁLOGOS MANUALES (Para evitar el "Not Found" de la API)
        // Si tu API no tiene estos endpoints, definirlos aquí es la solución más segura
        $tipos = [
            ['id_tipo_espacio' => 1, 'nombre_tipo_espacio' => 'Laboratorio'],
            ['id_tipo_espacio' => 2, 'nombre_tipo_espacio' => 'Aula'],
            ['id_tipo_espacio' => 3, 'nombre_tipo_espacio' => 'Auditorio'],
        ];

        $pisos = [
            ['id_piso' => 1, 'nombre_piso' => 'Planta Baja'],
            ['id_piso' => 2, 'nombre_piso' => 'Piso 1'],
            ['id_piso' => 3, 'nombre_piso' => 'Piso 2'],
        ];

        $equiposLista = [
            ['id_equipamiento' => 1, 'nombre_tipo_equipamiento' => 'Proyector'],
            ['id_equipamiento' => 2, 'nombre_tipo_equipamiento' => 'Aire Acondicionado'],
            ['id_equipamiento' => 3, 'nombre_tipo_equipamiento' => 'PC / Laptop'],
            ['id_equipamiento' => 4, 'nombre_tipo_equipamiento' => 'Pizarrón'],
        ];

        return view('admin.espacios-form', [
            'userData'      => Session::get('user_data', []),
            'espacio'       => $espacio,
            'idsAsignados'  => $idsAsignados,
            'equiposLista'  => $equiposLista,
            'tipos'         => $tipos,
            'pisos'         => $pisos
        ]);
    }

    public function espaciosStore(Request $request)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->post($this->apiUrl() . '/espacios', $request->all());

        if ($res->successful()) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => $res->json()['detail'] ?? 'Error'], 422);
    }

    public function espaciosUpdate(Request $request, $id)
    {
        $token = $this->token();
        $headers = ['Authorization' => "Bearer $token"];

        // 1. Datos del espacio
        $payload = [
            'nombre_espacio'    => $request->input('nombre'),
            'capacidad'         => (int)$request->input('capacidad'),
            'id_tipo_espacio'   => (int)$request->input('id_tipo_espacio'),
            'id_estado_espacio' => (int)$request->input('id_estado_espacio'),
            'id_piso'           => (int)$request->input('id_piso'),
        ];

        // 2. IDs de equipamiento (vienen del formulario como array)
        $equipos = $request->input('equipos', []); 

        try {
            // Actualizar espacio
            $res = Http::withHeaders($headers)->put($this->apiUrl() . "/espacios/{$id}", $payload);

            if ($res->successful()) {
                // 3. Sincronizar Equipamiento
                // Enviamos la lista de IDs a tu endpoint de relación
                Http::withHeaders($headers)->post($this->apiUrl() . "/espacios/{$id}/equipamiento", [
                    'ids_equipamiento' => $equipos
                ]);

                return response()->json(['success' => true]);
            }
            return response()->json(['success' => false, 'message' => 'Error al actualizar'], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function espaciosDestroy($id)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->delete($this->apiUrl() . "/espacios/{$id}");

        if ($res->successful()) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 422);
    }

    // ─── USUARIOS (OPTIMIZADO) ──────────────────────────────────────────────────
    public function usuarios()
    {
        // 1. Obtener todos los usuarios
        $resUsuarios = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                           ->get($this->apiUrl() . '/usuarios/');
        $usuarios = $resUsuarios->successful() ? $resUsuarios->json() : [];

        // 2. Obtener catálogo de carreras para mostrar nombres en la tabla
        $resCarreras = Http::get($this->apiUrl() . '/usuarios/catalogos/carreras');
        $carreras = collect($resCarreras->json())->pluck('nombre_carrera', 'id_carrera');

        // 3. Mapear nombres de carreras
        $usuariosConCarrera = collect($usuarios)->map(function ($u) use ($carreras) {
            $u['nombre_carrera'] = $carreras[$u['id_carrera']] ?? 'Sin carrera';
            return $u;
        });

        return view('admin.usuarios', [
            'userData' => Session::get('user_data', []),
            'usuarios' => $usuariosConCarrera
        ]);
    }

    public function usuariosCreate()
    {
        // Obtener catálogos para los selects del formulario
        $carreras = Http::get($this->apiUrl() . '/usuarios/catalogos/carreras')->json() ?? [];
        $roles    = Http::get($this->apiUrl() . '/usuarios/catalogos/roles')->json() ?? [];

        return view('admin.usuarios-form', [
            'userData' => Session::get('user_data', []),
            'usuario'  => null,
            'carreras' => $carreras,
            'roles'    => $roles
        ]);
    }

    public function usuariosUpdate(Request $request, $id)
    {
        // Usamos $request->input() para asegurar que lea el JSON del fetch
        $datosParaRender = [
            'matricula'    => $request->input('matricula'), // Agrégalo aunque sea readonly en el HTML
            'correo'       => $request->input('correo'),    // Agrégalo también
            'nombre'       => $request->input('nombre'),
            'apellido_p'   => $request->input('apellido_p'),
            'apellido_m'   => $request->input('apellido_m') ?? '',
            'cuatrimestre' => (int)$request->input('cuatrimestre'), 
            'id_carrera'   => (int)$request->input('id_carrera'),
            'id_rol'       => (int)$request->input('id_rol'), 
        ];

        try {
            $res = Http::withHeaders([
                'Authorization' => "Bearer {$this->token()}",
                'Accept'        => 'application/json',
            ])->put($this->apiUrl() . "/usuarios/{$id}", $datosParaRender);

            if ($res->successful()) {
                return response()->json(['success' => true]);
            }

            return response()->json([
                'success' => false,
                'message' => $res->json()['detail'] ?? 'Error en la API de Render',
                'debug'   => $res->json() // Para ver qué error devuelve FastAPI
            ], 422);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
    public function usuariosEdit($id)
    {
        // 1. Datos del usuario a editar
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->get($this->apiUrl() . "/usuarios/{$id}");
        $usuario = $res->successful() ? $res->json() : null;

        // 2. Catálogos para los selects
        $carreras = Http::get($this->apiUrl() . '/usuarios/catalogos/carreras')->json() ?? [];
        $roles    = Http::get($this->apiUrl() . '/usuarios/catalogos/roles')->json() ?? [];

        return view('admin.usuarios-form', [
            'userData' => Session::get('user_data', []),
            'usuario'  => $usuario,
            'carreras' => $carreras,
            'roles'    => $roles
        ]);
    }

    public function usuariosStore(Request $request)
    {
        // Importante: El registro suele ser un endpoint abierto o específico
        $res = Http::post($this->apiUrl() . '/auth/registro', $request->all());

        if ($res->successful()) {
            return response()->json(['success' => true]);
        }
        
        // Manejo de errores detallado de FastAPI
        return response()->json([
            'success' => false, 
            'message' => $res->json()['detail'] ?? 'Error al registrar'
        ], 422);
    }

    // ─── REPORTES ─────────────────────────────────────────────────────────────
    public function reportes()
    {
        return view('admin.reportes', [
            'userData' => Session::get('user_data', []),
        ]);
    }

    // ─── PERFIL ───────────────────────────────────────────────────────────────
    public function perfil()
    {
        $userData = Session::get('user_data', []);
        $id = $userData['id_usuario'] ?? null;

        if ($id) {
            $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                       ->get($this->apiUrl() . "/usuarios/{$id}");
            if ($res->successful()) {
                $userData = $res->json();
                Session::put('user_data', $userData);
            }
        }

        return view('admin.perfil', [
            'userData' => $userData,
        ]);
    }

    public function perfilEdit()
    {
        return view('admin.perfil-form', [
            'userData' => Session::get('user_data', []),
        ]);
    }

    public function perfilUpdate(Request $request)
    {
        $userData = Session::get('user_data', []);
        $id = $userData['id_usuario'] ?? null;

        if (!$id) {
            return response()->json(['success' => false, 'message' => 'Usuario no identificado'], 400);
        }

        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->put($this->apiUrl() . "/usuarios/{$id}", $request->all());

        if ($res->successful()) {
            Session::put('user_data', $res->json());
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => $res->json()['detail'] ?? 'Error'], 422);
    }

    // --- AGREGA ESTOS MÉTODOS AL FINAL DE TU AdminController (antes de la última llave) ---

    private function mapTipoEspacio($id)
    {
        $tipos = [
            1 => 'Laboratorio', 2 => 'Aula', 3 => 'Cancha', 
            4 => 'Cómputo', 5 => 'Auditorio', 6 => 'Juntas', 
            7 => 'Psicológico', 8 => 'Tutorías', 9 => 'Estudio'
        ];
        return $tipos[$id] ?? 'Otro';
    }

    private function mapEstadoEspacio($id)
    {
        // Basado en los colores de tu Blade: Disponible, Mantenimiento, Ocupado
        $estados = [
            1 => 'Disponible',
            2 => 'Mantenimiento',
            3 => 'Ocupado'
        ];
        return $estados[$id] ?? 'Desconocido';
    }

    private function mapEdificio($id_piso)
    {
        // Mapeo temporal basado en la columna id_piso de tu imagen
        // Si tienes una API de edificios, podrías llamarla aquí.
        $edificios = [
            1 => 'Edificio A', 2 => 'Edificio A', 3 => 'Edificio B',
            4 => 'Edificio B', 5 => 'Canchas', 6 => 'Edificio C'
        ];
        return $edificios[$id_piso] ?? 'General';
    }
}