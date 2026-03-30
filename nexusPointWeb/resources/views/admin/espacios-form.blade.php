@extends('layouts.app')

@section('titulo', $espacio ? 'Editar Espacio' : 'Nuevo Espacio')

@section('contenido')
<header class="section-header">
    <div>
        <h1>{{ $espacio ? 'Editar' : 'Nuevo' }} <span class="text-primario">Espacio</span></h1>
        <p>Define las características y el equipamiento del lugar.</p>
    </div>
</header>

<section class="form-container-white">
    <form id="espacioForm" class="grid-form">
        <div class="input-group">
            <label>Nombre del Espacio</label>
            <input type="text" name="nombre" placeholder="Ej: Laboratorio de Cómputo 1"
                   value="{{ $espacio['nombre'] ?? '' }}" required>
        </div>
        <div class="input-group">
            <label>Tipo de Espacio</label>
            <select name="tipo" class="custom-select" required>
                <option value="" disabled {{ !$espacio ? 'selected' : '' }}>Selecciona tipo...</option>
                @foreach(['Aula Magna','Laboratorio','Cubículo','Sala de Juntas','Auditorio'] as $tipo)
                    <option value="{{ $tipo }}" {{ ($espacio['tipo'] ?? '') === $tipo ? 'selected' : '' }}>{{ $tipo }}</option>
                @endforeach
            </select>
        </div>
        <div class="input-group">
            <label>Edificio</label>
            <select name="edificio" class="custom-select" required>
                <option value="" disabled {{ !$espacio ? 'selected' : '' }}>Selecciona edificio...</option>
                @foreach(['Edificio A','Edificio B','Edificio C','Edificio D','Biblioteca'] as $edif)
                    <option value="{{ $edif }}" {{ ($espacio['edificio'] ?? '') === $edif ? 'selected' : '' }}>{{ $edif }}</option>
                @endforeach
            </select>
        </div>
        <div class="input-group">
            <label>Piso / Nivel</label>
            <select name="piso" class="custom-select" required>
                <option value="" disabled {{ !$espacio ? 'selected' : '' }}>Selecciona nivel...</option>
                @foreach(['Planta Baja','Piso 1','Piso 2','Piso 3'] as $piso)
                    <option value="{{ $piso }}" {{ ($espacio['piso'] ?? '') === $piso ? 'selected' : '' }}>{{ $piso }}</option>
                @endforeach
            </select>
        </div>
        <div class="input-group">
            <label>Capacidad (Personas)</label>
            <input type="number" name="capacidad" placeholder="Ej: 35"
                   value="{{ $espacio['capacidad'] ?? '' }}" required>
        </div>
        <div class="input-group">
            <label>Estatus</label>
            <select name="estatus" class="custom-select">
                @foreach(['Disponible','Mantenimiento','Fuera de Servicio'] as $est)
                    <option value="{{ $est }}" {{ ($espacio['estatus'] ?? 'Disponible') === $est ? 'selected' : '' }}>{{ $est }}</option>
                @endforeach
            </select>
        </div>
        <div class="input-group full-width">
            <label style="margin-bottom:15px; display:block;">Equipamiento Disponible</label>
            <div class="checklist-grid">
                @php
                    $equipos = ['Proyector / Cañón','Pantalla Smart TV','Aire Acondicionado','Cómputo (PC/Laptops)',
                                'Pizarrón Blanco','Sistema de Audio','Conexión Ethernet','Wi-Fi Dedicado',
                                'Cámara Web (Híbrido)','Mobiliario Ergonómico'];
                    $equipoActual = $espacio['equipamiento'] ?? [];
                @endphp
                @foreach($equipos as $equipo)
                <label class="check-item">
                    <input type="checkbox" name="equipamiento[]" value="{{ $equipo }}"
                           {{ in_array($equipo, $equipoActual) ? 'checked' : '' }}>
                    <span>{{ $equipo }}</span>
                </label>
                @endforeach
            </div>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn-submit">Guardar Espacio</button>
            <a href="{{ route('admin.espacios') }}" class="btn-cancelar">Cancelar</a>
        </div>
    </form>
</section>

{{-- Modal éxito --}}
<div id="successModal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
        <div style="width:70px; height:70px; background:#d4edda; color:#28a745; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:35px; margin:0 auto 20px;">✓</div>
        <h2 id="modalTitle" style="color:var(--color-secundario); margin-bottom:10px;">¡Completado!</h2>
        <p id="modalMessage" style="color:#666;"></p>
        <button onclick="window.location.href='{{ route('admin.espacios') }}'"
            style="background:var(--color-primario); color:var(--color-secundario); border:none; padding:12px 30px; border-radius:50px; cursor:pointer; font-weight:700; margin-top:20px; width:100%;">
            Continuar
        </button>
    </div>
</div>
@endsection

@section('scripts')
<script>
    const isEdit = {{ $espacio ? 'true' : 'false' }};
    const espacioId = {{ $espacio ? ($espacio['id_espacio'] ?? $espacio['id'] ?? 0) : 0 }};

    document.getElementById('espacioForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Checkboxes múltiples
        data.equipamiento = [...document.querySelectorAll('input[name="equipamiento[]"]:checked')]
                             .map(cb => cb.value);

        const url    = isEdit ? `/admin/espacios/${espacioId}` : '/admin/espacios';
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
                document.getElementById('modalTitle').innerText   = isEdit ? 'Espacio Actualizado' : 'Espacio Creado';
                document.getElementById('modalMessage').innerText = isEdit
                    ? 'El espacio ha sido actualizado correctamente.'
                    : 'El nuevo espacio ha sido registrado con éxito.';
                document.getElementById('successModal').style.display = 'flex';
            } else {
                alert('Error: ' + (res.message || 'No se pudo guardar'));
            }
        })
        .catch(() => alert('Error de conexión con la API'));
    });
</script>
@endsection
