@extends('layouts.app')

@section('titulo', 'Editar Perfil')

@section('contenido')
<header class="section-header">
    <div>
        <h1>Editar <span class="text-primario">Información</span></h1>
        <p>Modifica tus datos de contacto.</p>
    </div>
</header>

<section class="form-container-white">
    <form id="profileForm" class="grid-form">
        <div class="input-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value="{{ $userData['nombre'] ?? '' }}" required>
        </div>
        <div class="input-group">
            <label>Apellido Paterno</label>
            <input type="text" name="apellido_p" value="{{ $userData['apellido_p'] ?? '' }}" required>
        </div>
        <div class="input-group">
            <label>Apellido Materno</label>
            <input type="text" name="apellido_m" value="{{ $userData['apellido_m'] ?? '' }}">
        </div>
        <div class="input-group">
            <label>Correo Electrónico</label>
            <input type="email" name="correo" value="{{ $userData['correo'] ?? '' }}" required>
        </div>
        <div class="input-group">
            <label>Cuatrimestre</label>
            <input type="number" name="cuatrimestre" min="1" max="12" value="{{ $userData['cuatrimestre'] ?? '' }}">
        </div>
        <div class="form-actions">
            <button type="button" class="btn-submit"
                onclick="document.getElementById('confirmSaveModal').style.display='flex'"
                style="border-radius:50px; padding:12px 35px;">
                Guardar Cambios
            </button>
            <a href="{{ route('admin.perfil') }}" class="btn-cancelar" style="border-radius:50px;">Cancelar</a>
        </div>
    </form>
</section>

{{-- Modal confirmación --}}
<div id="confirmSaveModal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
        <h3>¿Guardar cambios?</h3>
        <p>Se actualizará tu información en todo el sistema.</p>
        <div class="modal-actions" style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
            <button onclick="document.getElementById('confirmSaveModal').style.display='none'"
                style="background:#eee; color:#333; border:none; padding:10px 25px; border-radius:50px; cursor:pointer; font-weight:700;">
                Revisar
            </button>
            <button onclick="finalizeSave()"
                style="background:var(--color-secundario); color:white; border:2px solid var(--color-primario); padding:10px 25px; border-radius:50px; cursor:pointer; font-weight:700;">
                Confirmar
            </button>
        </div>
    </div>
</div>

{{-- Modal éxito --}}
<div id="successModal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
        <h3 style="color:var(--color-primario);">✔ ¡Éxito!</h3>
        <p>La información se guardó correctamente.</p>
        <button onclick="window.location.href='{{ route('admin.perfil') }}'"
            style="background:var(--color-secundario); color:white; border:2px solid var(--color-primario); padding:10px 25px; border-radius:50px; cursor:pointer; font-weight:700; margin-top:15px;">
            Aceptar
        </button>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function finalizeSave() {
        document.getElementById('confirmSaveModal').style.display = 'none';

        const formData = new FormData(document.getElementById('profileForm'));
        const data = Object.fromEntries(formData.entries());
        if (data.cuatrimestre) data.cuatrimestre = parseInt(data.cuatrimestre);

        fetch('{{ route('admin.perfil.update') }}', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(res => {
            if (res.success) {
                document.getElementById('successModal').style.display = 'flex';
            } else {
                alert('Error: ' + (res.message || 'No se pudo guardar'));
            }
        })
        .catch(() => alert('Error de conexión con la API'));
    }
</script>
@endsection
