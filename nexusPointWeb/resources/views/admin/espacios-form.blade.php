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
            {{-- Cambiamos value para que use 'nombre' que mapeamos en el Controller --}}
            <input type="text" name="nombre" placeholder="Ej: Laboratorio de Cómputo 1"
                   value="{{ $espacio['nombre'] ?? '' }}" required>
        </div>

        <div class="input-group">
            <label>Tipo de Espacio</label>
            <select name="id_tipo_espacio" class="custom-select" required>
                <option value="" disabled {{ !$espacio ? 'selected' : '' }}>Selecciona tipo...</option>
                @foreach($tipos as $t)
                    <option value="{{ $t['id_tipo_espacio'] }}" 
                        {{ ($espacio['id_tipo_espacio'] ?? '') == $t['id_tipo_espacio'] ? 'selected' : '' }}>
                        {{ $t['nombre_tipo_espacio'] }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="input-group">
            <label>Ubicación (Nivel)</label>
            <select name="id_piso" class="custom-select" required>
                <option value="" disabled {{ !$espacio ? 'selected' : '' }}>Selecciona ubicación...</option>
                @foreach($pisos as $p)
                    <option value="{{ $p['id_piso'] }}" 
                        {{ (isset($espacio['id_piso']) && $espacio['id_piso'] == $p['id_piso']) ? 'selected' : '' }}>
                        {{ $p['nombre_piso'] }}
                    </option>
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
            <select name="id_estado_espacio" class="custom-select">
                {{-- Mapeo numérico según tu BD: 1:Disponible, 2:Mantenimiento, 3:Ocupado --}}
                <option value="1" {{ ($espacio['id_estado_espacio'] ?? 1) == 1 ? 'selected' : '' }}>Disponible</option>
                <option value="2" {{ ($espacio['id_estado_espacio'] ?? '') == 2 ? 'selected' : '' }}>Mantenimiento</option>
                <option value="3" {{ ($espacio['id_estado_espacio'] ?? '') == 3 ? 'selected' : '' }}>Ocupado</option>
            </select>
        </div>

        <div class="input-group full-width">
            <label style="margin-bottom:15px; display:block;">Equipamiento Disponible</label>
            <div class="checklist-grid">
                {{-- Usamos la lista dinámica que viene de la BD --}}
                @foreach($equiposLista as $item)
                <label class="check-item">
                    <input type="checkbox" name="equipos[]" value="{{ $item['id_equipamiento'] }}"
                           {{ in_array($item['id_equipamiento'], $idsAsignados ?? []) ? 'checked' : '' }}>
                    <span>{{ $item['nombre_tipo_equipamiento'] }}</span>
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
    const espacioId = {{ $espacio ? $espacio['id'] : 0 }};

    document.getElementById('espacioForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Capturar los IDs de equipamiento correctamente para el AdminController
        data.equipos = [...document.querySelectorAll('input[name="equipos[]"]:checked')]
                        .map(cb => parseInt(cb.value));

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