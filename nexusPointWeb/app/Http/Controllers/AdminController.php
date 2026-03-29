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

    // ─── DASHBOARD ────────────────────────────────────────────────────────────
    public function dashboard()
    {
        $token = $this->token();
        $headers = ['Authorization' => "Bearer {$token}"];

        // Llamadas paralelas a la API
        $solicitudesRes = Http::withHeaders($headers)->get($this->apiUrl() . '/solicitudes');
        $espaciosRes    = Http::withHeaders($headers)->get($this->apiUrl() . '/espacios');

        $solicitudes = $solicitudesRes->successful() ? $solicitudesRes->json() : [];
        $espacios    = $espaciosRes->successful()    ? $espaciosRes->json()    : [];

        // Calcular estadísticas
        $totalSolicitudes = count($solicitudes);
        $espaciosActivos  = count(array_filter($espacios, fn($e) => ($e['estatus'] ?? '') === 'Disponible'));

        $aprobadas = count(array_filter($solicitudes, fn($s) => ($s['estatus'] ?? '') === 'Aprobado'));
        $tasaAprobacion = $totalSolicitudes > 0 ? round(($aprobadas / $totalSolicitudes) * 100) : 0;

        // Solicitudes por día de la semana
        $dias = ['Lun' => 0, 'Mar' => 0, 'Mié' => 0, 'Jue' => 0, 'Vie' => 0, 'Sáb' => 0, 'Dom' => 0];
        $mapaDias = ['Monday' => 'Lun', 'Tuesday' => 'Mar', 'Wednesday' => 'Mié',
                     'Thursday' => 'Jue', 'Friday' => 'Vie', 'Saturday' => 'Sáb', 'Sunday' => 'Dom'];
        foreach ($solicitudes as $s) {
            if (!empty($s['fecha_solicitud'])) {
                $diaNombre = date('l', strtotime($s['fecha_solicitud']));
                $diaCorto  = $mapaDias[$diaNombre] ?? null;
                if ($diaCorto) $dias[$diaCorto]++;
            }
        }

        // Ocupación por edificio (basada en espacios)
        $edificios = [];
        foreach ($espacios as $e) {
            $edif = $e['edificio'] ?? 'Sin edificio';
            $edificios[$edif] = ($edificios[$edif] ?? 0) + 1;
        }

        return view('admin.dashboard', [
            'userData'           => Session::get('user_data', []),
            'totalSolicitudes'   => $totalSolicitudes,
            'espaciosActivos'    => $espaciosActivos,
            'tasaAprobacion'     => $tasaAprobacion,
            'diasSemana'         => $dias,
            'ocupacionEdificios' => $edificios,
        ]);
    }

    // ─── SOLICITUDES ──────────────────────────────────────────────────────────
    public function solicitudes()
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->get($this->apiUrl() . '/solicitudes');

        $solicitudes = $res->successful() ? $res->json() : [];

        return view('admin.solicitudes', [
            'userData'     => Session::get('user_data', []),
            'solicitudes'  => $solicitudes,
        ]);
    }

    // Aprobar/Rechazar solicitud (llamado vía fetch desde la vista)
    public function actualizarSolicitud(Request $request, $id)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->patch($this->apiUrl() . "/solicitudes/{$id}", [
                       'estatus' => $request->input('estatus'),
                   ]);

        if ($res->successful()) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => $res->json()['detail'] ?? 'Error'], 422);
    }

    // ─── ESPACIOS ─────────────────────────────────────────────────────────────
    public function espacios()
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->get($this->apiUrl() . '/espacios');

        $espacios = $res->successful() ? $res->json() : [];

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
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->get($this->apiUrl() . "/espacios/{$id}");

        $espacio = $res->successful() ? $res->json() : null;

        return view('admin.espacios-form', [
            'userData' => Session::get('user_data', []),
            'espacio'  => $espacio,
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
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->put($this->apiUrl() . "/espacios/{$id}", $request->all());

        if ($res->successful()) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => $res->json()['detail'] ?? 'Error'], 422);
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

    // ─── USUARIOS ─────────────────────────────────────────────────────────────
    public function usuarios()
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->get($this->apiUrl() . '/usuarios');

        $usuarios = $res->successful() ? $res->json() : [];

        return view('admin.usuarios', [
            'userData' => Session::get('user_data', []),
            'usuarios' => $usuarios,
        ]);
    }

    public function usuariosCreate()
    {
        return view('admin.usuarios-form', [
            'userData' => Session::get('user_data', []),
            'usuario'  => null,
        ]);
    }

    public function usuariosEdit($id)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->get($this->apiUrl() . "/usuarios/{$id}");

        $usuario = $res->successful() ? $res->json() : null;

        return view('admin.usuarios-form', [
            'userData' => Session::get('user_data', []),
            'usuario'  => $usuario,
        ]);
    }

    public function usuariosStore(Request $request)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->post($this->apiUrl() . '/auth/registro', $request->all());

        if ($res->successful()) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => $res->json()['detail'] ?? 'Error'], 422);
    }

    public function usuariosUpdate(Request $request, $id)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->put($this->apiUrl() . "/usuarios/{$id}", $request->all());

        if ($res->successful()) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => $res->json()['detail'] ?? 'Error'], 422);
    }

    public function usuariosDestroy($id)
    {
        $res = Http::withHeaders(['Authorization' => "Bearer {$this->token()}"])
                   ->delete($this->apiUrl() . "/usuarios/{$id}");

        if ($res->successful()) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 422);
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
}