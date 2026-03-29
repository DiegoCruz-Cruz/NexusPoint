@extends('layouts.app')

@section('titulo', $usuario ? 'Editar Usuario' : 'Nuevo Usuario')

@section('contenido')
<header class="section-header">
    <div>
        <h1>{{ $usuario ? 'Editar' : 'Nuevo' }} <span class="text-primario">Usuario</span></h1>
        <p>Registra los datos institucionales del usuario.</p>
    </div>
</header>

<section class="form-container-white">
    <form id="userForm" class="grid-form">
        <div class="input-group">
            <label>Matrícula</label>
            <input type="text" name="matricula" placeholder="Ej: D001234"
                   value="{{ $usuario['matricula'] ?? '' }}" {{ $usuario ? 'readonly' : 'required' }}>
        </div>
        <div class="input-group">
            <label>Nombre</label>
            <input type="text" name="nombre" placeholder="Nombre(s)"
                   value="{{ $usuario['nombre'] ?? '' }}" required>
        </div>
        <div class="input-group">
            <label>Apellido Paterno</label>
            <input type="text" name="apellido_p" placeholder="Apellido paterno"
                   value="{{ $usuario['apellido_p'] ?? '' }}" required>
        </div>
        <div class="input-group">
            <label>Apellido Materno</label>
            <input type="text" name="apellido_m" placeholder="Apellido materno"
                   value="{{ $usuario['apellido_m'] ?? '' }}">
        </div>
        <div class="input-group">
            <label>Correo Institucional</label>
            <input type="email" name="correo" placeholder="usuario@nexuspoint.edu"
                   value="{{ $usuario['correo'] ?? '' }}" required>
        </div>
        @if(!$usuario)
        <div class="input-group">
            <label>Contraseña</label>
            <input type="password" name="contrasenia" placeholder="Mínimo 8 caracteres" required>
        </div>
        @endif
        <div class="input-group">
            <label>Cuatrimestre</label>
            <input type="number" name="cuatrimestre" min="1" max="12"
                   value="{{ $usuario['cuatrimestre'] ?? '' }}" placeholder="Ej: 4">
        </div>
        <div class="input-group">
            <label>Rol</label>
            <select name="id_rol" class="custom-select" required>
                <option value="1" {{ ($usuario['id_rol'] ?? 0) == 1 ? 'selected' : '' }}>Administrador</option>
                <option value="2" {{ ($usuario['id_rol'] ?? 0) == 2 ? 'selected' : '' }}>Docente</option>
                <option value="3" {{ ($usuario['id_rol'] ?? 0) == 3 ? 'selected' : '' }}>Personal</option>
            </select>
        </div>
        <div class="input-group">
            <label>ID Carrera</label>
            <input type="number" name="id_carrera" placeholder="Ej: 1"
                   value="{{ $usuario['id_carrera'] ?? '' }}" required>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn-submit">Guardar Usuario</button>
            <a href="{{ route('admin.usuarios') }}" class="btn-cancelar">Cancelar</a>
        </div>
    </form>
</section>

{{-- Modal éxito --}}
<div id="successModal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
        <div style="width:70px; height:70px; background:#d4edda; color:#28a745; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:35px; margin:0 auto 20px;">✓</div>
        <h2 id="modalTitle" style="color:var(--color-secundario); margin-bottom:10px;">¡Éxito!</h2>
        <p id="modalMessage" style="color:#666;"></p>
        <button onclick="window.location.href='{{ route('admin.usuarios') }}'"
            style="background:var(--color-primario); color:var(--color-secundario); border:none; padding:12px 30px; border-radius:50px; cursor:pointer; font-weight:700; margin-top:20px; width:100%;">
            Continuar
        </button>
    </div>
</div>
@endsection

@section('scripts')
<script>
    const isEdit   = {{ $usuario ? 'true' : 'false' }};
    const usuarioId = {{ $usuario ? ($usuario['id_usuario'] ?? $usuario['id'] ?? 0) : 0 }};

    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        // Convertir a número
        data.id_rol      = parseInt(data.id_rol);
        data.id_carrera  = parseInt(data.id_carrera);
        data.cuatrimestre = parseInt(data.cuatrimestre) || 1;

        const url    = isEdit ? `/admin/usuarios/${usuarioId}` : '/admin/usuarios';
        const method = isEdit ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(res => {
            if (res.success) {
                document.getElementById('modalTitle').innerText   = isEdit ? 'Usuario Actualizado' : 'Usuario Creado';
                document.getElementById('modalMessage').innerText = isEdit
                    ? 'Los datos se han actualizado correctamente.'
                    : 'El usuario ha sido registrado en el sistema.';
                document.getElementById('successModal').style.display = 'flex';
            } else {
                alert('Error: ' + (res.message || 'No se pudo guardar'));
            }
        })
        .catch(() => alert('Error de conexión con la API'));
    });
</script>
@endsection
