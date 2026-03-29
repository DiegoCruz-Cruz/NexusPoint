@extends('layouts.app')

@section('titulo', 'Usuarios')

@section('contenido')
<header class="section-header">
    <div>
        <h1>Gestión de <span class="text-primario">Usuarios</span></h1>
        <p>Administra los usuarios registrados en el sistema.</p>
    </div>
    <a href="{{ route('admin.usuarios.create') }}"
       style="display:inline-flex; align-items:center; background:var(--color-secundario); color:white; padding:12px 28px; border-radius:50px; text-decoration:none; font-weight:700; border:2px solid var(--color-primario);">
        + Nuevo Usuario
    </a>
</header>

<section class="search-bar-container">
    <div class="search-box">
        <input type="text" id="searchInput" placeholder="Buscar por matrícula o nombre..." onkeyup="filterTable()">
    </div>
</section>

<section class="table-container">
    @if(count($usuarios) === 0)
        <p style="text-align:center; color:#aaa; padding:40px 0;">No hay usuarios registrados todavía.</p>
    @else
    <table id="usuariosTable">
        <thead>
            <tr>
                <th>Matrícula</th>
                <th>Nombre Completo</th>
                <th>Correo</th>
                <th>Carrera</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style="text-align:center;">Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($usuarios as $u)
            <tr>
                <td>{{ $u['matricula'] ?? '—' }}</td>
                <td><strong>{{ ($u['nombre'] ?? '') . ' ' . ($u['apellido_p'] ?? '') . ' ' . ($u['apellido_m'] ?? '') }}</strong></td>
                <td>{{ $u['correo'] ?? '—' }}</td>
                <td>{{ $u['nombre_carrera'] ?? $u['id_carrera'] ?? '—' }}</td>
                <td>
                    @php $rol = $u['id_rol'] ?? 0; @endphp
                    <span class="badge {{ $rol == 1 ? 'badge-admin' : ($rol == 2 ? 'badge-docente' : 'badge-personal') }}">
                        {{ $rol == 1 ? 'Admin' : ($rol == 2 ? 'Docente' : 'Personal') }}
                    </span>
                </td>
                <td>
                    @php $activo = $u['activo'] ?? true; @endphp
                    <span class="status {{ $activo ? 'status-approved' : 'status-suspended' }}">
                        {{ $activo ? 'Activo' : 'Inactivo' }}
                    </span>
                </td>
                <td>
                    <div class="actions-wrapper" style="display:flex; gap:10px; justify-content:center;">
                        <a href="{{ route('admin.usuarios.edit', $u['id_usuario'] ?? $u['id']) }}"
                           class="btn-action btn-edit" title="Editar">✎</a>
                        <button class="btn-action btn-delete" title="Eliminar"
                            onclick="openDeleteModal({{ $u['id_usuario'] ?? $u['id'] }}, '{{ $u['nombre'] ?? '' }}')">🗑</button>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif
</section>

{{-- Modal eliminar --}}
<div id="deleteModal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
        <div style="font-size:2.5rem; margin-bottom:10px;">⚠️</div>
        <h3 style="color:var(--color-secundario);">¿Eliminar usuario?</h3>
        <p id="deleteText" style="color:#666; margin-top:8px;"></p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
            <button style="background:#eee; color:#333; border:none; padding:8px 20px; border-radius:50px; cursor:pointer; font-weight:700;"
                onclick="closeDeleteModal()">Cancelar</button>
            <button style="background:#e74c3c; color:white; border:none; padding:8px 20px; border-radius:50px; cursor:pointer; font-weight:700;"
                onclick="confirmDelete()">Eliminar</button>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    let deleteId = 0;

    function openDeleteModal(id, nombre) {
        deleteId = id;
        document.getElementById('deleteText').innerText = `Se eliminará a "${nombre}" del sistema.`;
        document.getElementById('deleteModal').style.display = 'flex';
    }
    function closeDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
    }
    function confirmDelete() {
        fetch(`/admin/usuarios/${deleteId}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
        })
        .then(r => r.json())
        .then(data => {
            closeDeleteModal();
            if (data.success) location.reload();
            else alert('Error al eliminar usuario');
        });
    }
    function filterTable() {
        const filter = document.getElementById("searchInput").value.toUpperCase();
        document.querySelectorAll("#usuariosTable tbody tr").forEach(row => {
            row.style.display = row.textContent.toUpperCase().includes(filter) ? '' : 'none';
        });
    }
</script>
@endsection
