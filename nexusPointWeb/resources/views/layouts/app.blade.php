<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>NexusPoint - Admin</title>
    </head>
<body style="display: flex;">

    <nav style="width: 250px; background-color: #1a202c; color: white; height: 100vh; padding: 20px;">
        <h2>NexusPoint</h2>
        <ul>
            <li><a href="{{ route('admin.dashboard') }}" style="color: white;">Dashboard</a></li>
            <li><a href="{{ route('admin.solicitudes') }}" style="color: white;">Solicitudes</a></li>
            <li><a href="{{ route('admin.espacios') }}" style="color: white;">Espacios</a></li>
            <li><a href="{{ route('admin.usuarios') }}" style="color: white;">Usuarios</a></li>
            <li><a href="{{ route('admin.reportes') }}" style="color: white;">Reportes</a></li>
        </ul>
        <br><br>
        <a href="{{ route('login') }}" style="color: red;">Cerrar Sesión</a>
    </nav>

    <main style="flex: 1; padding: 40px; background-color: #f3f4f6;">
        @yield('contenido')
    </main>

</body>
</html>