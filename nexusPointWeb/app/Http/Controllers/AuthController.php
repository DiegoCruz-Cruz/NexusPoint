<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validar entrada del formulario (login.js envía 'email' y 'password')
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // 2. Llamada al endpoint POST /auth/login de la API NexusPoint
        //    El schema LoginRequest de la API espera: 'correo' y 'password'
        $response = Http::post(env('NEXUSPOINT_API_URL') . '/auth/login', [
            'correo'      => $request->email,
            'contrasenia' => $request->password, // LoginRequest espera 'contrasenia', no 'password'
        ]);

        // 3. Respuesta exitosa — la API devuelve el schema Token:
        //    { access_token: string, token_type: string, usuario: {...} }
        if ($response->successful()) {
            $data = $response->json();

            // Guardar token y datos del usuario en sesión de Laravel
            Session::put('api_token', $data['access_token']);       // CORRECCIÓN: antes era $data['token']
            Session::put('user_data', $data['usuario'] ?? null);    // CORRECCIÓN: antes era $data['user']

            return response()->json([
                'success'  => true,
                'redirect' => route('admin.dashboard'),
            ]);
        }

        // 4. Credenciales inválidas o error de la API
        return response()->json([
            'success' => false,
            'message' => $response->json()['detail'] ?? 'Credenciales incorrectas',  // FastAPI usa 'detail'
        ], 401);
    }

    public function logout()
    {
        // Limpiar sesión y redirigir al login
        Session::forget(['api_token', 'user_data']);
        return redirect()->route('login');
    }
}