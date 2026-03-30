@extends('layouts.app')

@section('titulo', 'Solicitudes')

@section('contenido')
<header class="section-header">
    <h1>Gestión de <span class="text-primario">Solicitudes</span></h1>
    <p>Revisa y gestiona las reservas de espacios de la institución.</p>
</header>

<section class="search-bar-container">
    <div class="search-box">
        <input type="text" id="searchInput" placeholder="Buscar por matrícula o solicitante..." onkeyup="filterTable()">
    </div>
</section>

<section class="table-container">
    @if(count($solicitudes) === 0)
        <p style="text-align:center; color:#aaa; padding: 40px 0;">No hay solicitudes registradas todavía.</p>
    @else
    <table id="requestsTable">
        <thead>
            <tr>
                <th>Matrícula</th>
                <th>Solicitante</th>
                <th>Espacio</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estatus</th>
                <th style="text-align:center;">Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($solicitudes as $s)
            <tr>
                <td>{{ $s['matricula'] ?? $s['id_usuario'] ?? '—' }}</td>
                <td><strong>{{ $s['nombre_usuario'] ?? ($s['nombre'] ?? '—') }}</strong></td>
                <td>{{ $s['nombre_espacio'] ?? $s['id_espacio'] ?? '—' }}</td>
                <td>{{ isset($s['fecha_solicitud']) ? \Carbon\Carbon::parse($s['fecha_solicitud'])->format('d/m/Y') : '—' }}</td>
                <td>{{ ($s['hora_inicio'] ?? '—') . ' - ' . ($s['hora_fin'] ?? '—') }}</td>
                <td>
                    @php $est = $s['estatus'] ?? 'Pendiente'; @endphp
                    <span class="status {{ $est === 'Aprobado' ? 'status-approved' : ($est === 'Rechazado' ? 'status-suspended' : 'status-pending') }}">
                        {{ $est }}
                    </span>
                </td>
                <td>
                    <div class="actions-wrapper" style="display:flex; gap:10px; justify-content:center;">
                        <button class="btn-action btn-edit" title="Aprobar"
                            onclick="openModal('aprobar', {{ $s['id_solicitud'] ?? $s['id'] ?? 0 }})">✓</button>
                        <button class="btn-action btn-delete" title="Rechazar"
                            onclick="openModal('rechazar', {{ $s['id_solicitud'] ?? $s['id'] ?? 0 }})">✕</button>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif
</section>

{{-- Modal confirmación --}}
<div id="actionModal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
        <h3 id="modalTitle" style="color:var(--color-secundario);"></h3>
        <p id="modalText" style="margin-top:10px; color:#666;"></p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
            <button style="background:#eee; color:#333; border:none; padding:8px 20px; border-radius:50px; cursor:pointer; font-weight:700;"
                onclick="closeModal()">Cancelar</button>
            <button style="background:var(--color-secundario); color:white; border:2px solid var(--color-primario); padding:8px 20px; border-radius:50px; cursor:pointer; font-weight:700;"
                onclick="confirmAction()">Confirmar</button>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    let currentAction = "";
    let currentId = 0;

    function openModal(action, id) {
        currentAction = action;
        currentId = id;
        document.getElementById('modalTitle').innerText = action === 'aprobar' ? '✓ Aprobar Solicitud' : '✕ Rechazar Solicitud';
        document.getElementById('modalText').innerText  = action === 'aprobar'
            ? '¿Deseas marcar esta solicitud como aprobada?'
            : '¿Deseas rechazar esta solicitud? El usuario será notificado.';
        document.getElementById('actionModal').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('actionModal').style.display = 'none';
    }

    function confirmAction() {
        const estatus = currentAction === 'aprobar' ? 'Aprobado' : 'Rechazado';

        fetch(`/admin/solicitudes/${currentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ estatus })
        })
        .then(r => r.json())
        .then(data => {
            closeModal();
            if (data.success) location.reload();
            else alert('Error: ' + (data.message || 'No se pudo actualizar'));
        })
        .catch(() => { closeModal(); alert('Error de conexión'); });
    }

    function filterTable() {
        const filter = document.getElementById("searchInput").value.toUpperCase();
        const rows   = document.querySelectorAll("#requestsTable tbody tr");
        rows.forEach(row => {
            const cols = row.querySelectorAll("td");
            const text = (cols[0]?.textContent || '') + (cols[1]?.textContent || '');
            row.style.display = text.toUpperCase().includes(filter) ? '' : 'none';
        });
    }
</script>
@endsection
