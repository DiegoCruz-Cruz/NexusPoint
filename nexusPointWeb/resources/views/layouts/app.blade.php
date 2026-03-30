<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('titulo', 'NexusPoint') | NexusPoint</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    @yield('head')
</head>
<body class="dashboard-body">
    <div class="dashboard-container">

        {{-- ===== SIDEBAR ===== --}}
        <nav class="sidebar">
            <div class="sidebar-header">
                <img src="{{ asset('img/logo.png') }}" alt="NP" class="mini-logo">
                <span>NexusPoint</span>
            </div>
            <ul class="nav-links">
                <li><a href="{{ route('admin.dashboard') }}"   class="{{ request()->routeIs('admin.dashboard')   ? 'active' : '' }}">Dashboard</a></li>
                <li><a href="{{ route('admin.solicitudes') }}" class="{{ request()->routeIs('admin.solicitudes') ? 'active' : '' }}">Solicitudes</a></li>
                <li><a href="{{ route('admin.espacios') }}"    class="{{ request()->routeIs('admin.espacios')    ? 'active' : '' }}">Espacios</a></li>
                <li><a href="{{ route('admin.usuarios') }}"    class="{{ request()->routeIs('admin.usuarios')    ? 'active' : '' }}">Usuarios</a></li>
                <li><a href="{{ route('admin.reportes') }}"    class="{{ request()->routeIs('admin.reportes')    ? 'active' : '' }}">Reportes</a></li>
            </ul>
            <div class="sidebar-footer">
                <a href="#" class="sidebar-user-link">
                    <div class="user-avatar">
                        {{ isset($userData['nombre']) ? strtoupper(substr($userData['nombre'], 0, 1)) : 'A' }}
                    </div>
                    <div class="user-info">
                        <span class="user-name">
                            {{ ($userData['nombre'] ?? '') . ' ' . ($userData['apellido_p'] ?? '') }}
                        </span>
                        <span class="user-role">
                            {{ ($userData['id_rol'] ?? 0) == 1 ? 'Administrador' : 'Usuario' }}
                        </span>
                    </div>
                </a>
                <a href="{{ route('logout') }}" class="logout-link"
                   style="color: var(--danger); padding-left: 12px; font-size: 0.85rem; text-decoration: none; font-weight: 600;">
                    Cerrar Sesión
                </a>
            </div>
        </nav>

        {{-- ===== CONTENIDO DE CADA VISTA ===== --}}
        <main class="main-content">
            @yield('contenido')
        </main>

    </div>

    {{-- Modal de descarga global --}}
    <div id="modalDescarga" class="modal-overlay" style="display:none;">
        <div class="modal-content">
            <div class="loader"></div>
            <h3>Descargando reporte...</h3>
            <p>Por favor, espera un momento mientras generamos tu archivo PDF.</p>
        </div>
    </div>

    @yield('scripts')
</body>
</html>