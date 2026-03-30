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

    // ─── ESPACIOS ─────────────────────────────────────────────
    public function espacios()
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->get($this->apiUrl() . '/espacios/');

        return view('admin.espacios', [
            'userData' => Session::get('user_data', []),
            'espacios' => $res->successful() ? $res->json() : [],
        ]);
    }

    public function espaciosStore(Request $request)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->post($this->apiUrl() . '/espacios/', $request->all());

        return response()->json(['success' => $res->successful()]);
    }

    public function espaciosUpdate(Request $request, $id)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->put($this->apiUrl() . "/espacios/{$id}", $request->all());

        return response()->json(['success' => $res->successful()]);
    }

    public function espaciosDestroy($id)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->delete($this->apiUrl() . "/espacios/{$id}");

        return response()->json(['success' => $res->successful()]);
    }

    // ─── USUARIOS ─────────────────────────────────────────────
    public function usuarios()
    {
        $headers = ['Authorization' => "Bearer {$this->token()}"];

        $usuarios = Http::withHeaders($headers)->get($this->apiUrl() . '/usuarios')->json() ?? [];

        $carreras = collect(Http::get($this->apiUrl() . '/usuarios/catalogos/carreras')->json())
                    ->pluck('nombre_carrera', 'id_carrera');

        $usuarios = collect($usuarios)->map(function ($u) use ($carreras) {
            $u['nombre_carrera'] = $carreras[$u['id_carrera']] ?? 'Sin carrera';
            return $u;
        });

        return view('admin.usuarios', [
            'userData' => Session::get('user_data', []),
            'usuarios' => $usuarios,
        ]);
    }

    public function usuariosStore(Request $request)
    {
        $res = Http::post($this->apiUrl() . '/auth/registro', $request->all());

        return response()->json([
            'success' => $res->successful(),
            'message' => $res->json()['detail'] ?? null,
        ], $res->successful() ? 200 : 422);
    }

    // ─── PERFIL ─────────────────────────────────────────────
    public function perfil()
    {
        return view('admin.perfil', [
            'userData' => Session::get('user_data', []),
        ]);
    }
}