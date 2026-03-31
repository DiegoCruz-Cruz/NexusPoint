@extends('layouts.app')

@section('titulo', 'Gestión de Solicitudes')

@section('contenido')
<header class="section-header">
    <h1>Gestión de <span class="text-primario">Solicitudes</span></h1>
    <p>Administra las reservas según su estado actual en el sistema.</p>
</header>

<section class="search-bar-container">
    <div class="search-box">
        <input type="text" id="searchInput" placeholder="Buscar por matrícula o nombre..." onkeyup="filterAllTables()">
    </div>
</section>

{{-- 1. TABLA PENDIENTES (ID: 1) --}}
<div class="table-section" style="margin-bottom: 40px;">
    <h2 style="color: var(--color-secundario); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        <span style="width:12px; height:12px; background:#ffc107; border-radius:50%;"></span> Pendientes de Revisión
    </h2>
    <div class="table-container">
        <table class="requestsTable" id="table-1">
            <thead>
                <tr>
                    <th>Matrícula</th>
                    <th>Solicitante</th>
                    <th>Espacio</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th style="text-align:center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($solicitudes['pendientes'] as $s)
                <tr>
                    <td>{{ $s['matricula'] ?? $s['id_usuario'] ?? '—' }}</td>
                    <td><strong>{{ $s['nombre_usuario'] ?? '—' }}</strong></td>
                    <td>{{ $s['nombre_espacio'] ?? '—' }}</td>
                    <td>{{ isset($s['fecha_solicitud']) ? \Carbon\Carbon::parse($s['fecha_solicitud'])->format('d/m/Y') : '—' }}</td>
                    <td>{{ ($s['hora_inicio'] ?? '—') }} - {{ ($s['hora_fin'] ?? '—') }}</td>
                    <td>
                        <div style="display:flex; gap:8px; justify-content:center;">
                            <button class="btn-action btn-edit" title="Aprobar" onclick="openModal('aprobar', {{ $s['id_reservacion'] ?? $s['id'] }})">✓</button>
                            <button class="btn-action btn-delete" title="Rechazar" onclick="openModal('rechazar', {{ $s['id_reservacion'] ?? $s['id'] }})">✕</button>
                        </div>
                    </td>
                </tr>
                @empty
                <tr><td colspan="6" style="text-align:center; color:#aaa; padding:20px;">No hay solicitudes pendientes.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{-- 2. TABLA APROBADAS (ID: 2) --}}
<div class="table-section" style="margin-bottom: 40px;">
    <h2 style="color: var(--color-secundario); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        <span style="width:12px; height:12px; background:#28a745; border-radius:50%;"></span> Próximas (Aprobadas)
    </h2>
    <div class="table-container">
        <table class="requestsTable" id="table-2">
            <thead>
                <tr>
                    <th>Matrícula</th>
                    <th>Solicitante</th>
                    <th>Espacio</th>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Estatus</th>
                </tr>
            </thead>
            <tbody>
                @forelse($solicitudes['aprobadas'] as $s)
                <tr>
                    <td>{{ $s['matricula'] ?? $s['id_usuario'] ?? '—' }}</td>
                    <td>{{ $s['nombre_usuario'] ?? '—' }}</td>
                    <td>{{ $s['nombre_espacio'] ?? '—' }}</td>
                    <td>{{ isset($s['fecha_solicitud']) ? \Carbon\Carbon::parse($s['fecha_solicitud'])->format('d/m/Y') : '—' }}</td>
                    <td>{{ ($s['hora_inicio'] ?? '—') }} - {{ ($s['hora_fin'] ?? '—') }}</td>
                    <td><span class="status status-approved">Aprobado</span></td>
                </tr>
                @empty
                <tr><td colspan="6" style="text-align:center; color:#aaa; padding:20px;">No hay solicitudes aprobadas.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{-- 3. TABLA RECHAZADAS (ID: 3) --}}
<div class="table-section" style="margin-bottom: 40px;">
    <h2 style="color: var(--color-secundario); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        <span style="width:12px; height:12px; background:#dc3545; border-radius:50%;"></span> Rechazadas
    </h2>
    <div class="table-container">
        <table class="requestsTable" id="table-3">
            <tbody>
                @forelse($solicitudes['rechazadas'] as $s)
                <tr>
                    <td width="15%">{{ $s['matricula'] ?? $s['id_usuario'] ?? '—' }}</td>
                    <td width="25%">{{ $s['nombre_usuario'] ?? '—' }}</td>
                    <td>{{ $s['nombre_espacio'] ?? '—' }}</td>
                    <td>{{ isset($s['fecha_solicitud']) ? \Carbon\Carbon::parse($s['fecha_solicitud'])->format('d/m/Y') : '—' }}</td>
                    <td><span class="status status-suspended">Rechazado</span></td>
                </tr>
                @empty
                <tr><td colspan="5" style="text-align:center; color:#aaa; padding:20px;">Sin registros.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{-- 4. TABLA FINALIZADAS (ID: 4) --}}
<div class="table-section" style="margin-bottom: 40px;">
    <h2 style="color: var(--color-secundario); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        <span style="width:12px; height:12px; background:#6c757d; border-radius:50%;"></span> Historial (Finalizadas)
    </h2>
    <div class="table-container">
        <table class="requestsTable" id="table-4">
            <tbody>
                @forelse($solicitudes['finalizadas'] as $s)
                <tr>
                    <td>{{ $s['matricula'] ?? $s['id_usuario'] ?? '—' }}</td>
                    <td>{{ $s['nombre_usuario'] ?? '—' }}</td>
                    <td>{{ $s['nombre_espacio'] ?? '—' }}</td>
                    <td>{{ isset($s['fecha_solicitud']) ? \Carbon\Carbon::parse($s['fecha_solicitud'])->format('d/m/Y') : '—' }}</td>
                    <td><span class="status" style="background:#eee; color:#666;">Finalizada</span></td>
                </tr>
                @empty
                <tr><td colspan="5" style="text-align:center; color:#aaa; padding:20px;">No hay historial de finalizadas.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{-- 5. TABLA CANCELADAS (ID: 5) --}}
<div class="table-section">
    <h2 style="color: var(--color-secundario); margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        <span style="width:12px; height:12px; background:#000; border-radius:50%;"></span> Canceladas por Usuario
    </h2>
    <div class="table-container">
        <table class="requestsTable" id="table-5">
            <tbody>
                @forelse($solicitudes['canceladas'] as $s)
                <tr>
                    <td>{{ $s['matricula'] ?? $s['id_usuario'] ?? '—' }}</td>
                    <td>{{ $s['nombre_usuario'] ?? '—' }}</td>
                    <td>{{ $s['nombre_espacio'] ?? '—' }}</td>
                    <td>{{ isset($s['fecha_solicitud']) ? \Carbon\Carbon::parse($s['fecha_solicitud'])->format('d/m/Y') : '—' }}</td>
                    <td><span class="status" style="background:#f8d7da; color:#721c24;">Cancelada</span></td>
                </tr>
                @empty
                <tr><td colspan="5" style="text-align:center; color:#aaa; padding:20px;">No hay reservaciones canceladas.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

{{-- Modal Acción --}}
<div id="actionModal" class="modal-overlay" style="display:none;">
    <div class="modal-content">
        <h3 id="modalTitle"></h3>
        <p id="modalText" style="margin: 15px 0; color:#666;"></p>
        <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
            <button class="btn-cancelar" onclick="closeModal()" style="padding:10px 25px;">Volver</button>
            <button class="btn-submit" id="confirmBtn" onclick="confirmAction()" style="padding:10px 25px;">Aplicar Cambio</button>
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
        const isApprove = action === 'aprobar';
        
        document.getElementById('modalTitle').innerText = isApprove ? '✓ Confirmar Aprobación' : '✕ Confirmar Rechazo';
        document.getElementById('modalTitle').style.color = isApprove ? '#28a745' : '#dc3545';
        document.getElementById('modalText').innerText = isApprove 
            ? 'La reservación será confirmada y el espacio quedará apartado.' 
            : 'La solicitud será rechazada y el usuario podrá ver el motivo.';
        
        document.getElementById('actionModal').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('actionModal').style.display = 'none';
    }

    function confirmAction() {
        const estatus = currentAction === 'aprobar' ? 'Aprobado' : 'Rechazado';
        const btn = document.getElementById('confirmBtn');
        btn.disabled = true;
        btn.innerText = 'Procesando...';

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
            if (data.success) location.reload();
            else {
                alert('Error: ' + (data.message || 'No se pudo procesar'));
                btn.disabled = false;
                btn.innerText = 'Aplicar Cambio';
            }
        })
        .catch(() => {
            alert('Error de red');
            btn.disabled = false;
        });
    }

    function filterAllTables() {
        const filter = document.getElementById("searchInput").value.toUpperCase();
        const allTables = document.querySelectorAll(".requestsTable");
        
        allTables.forEach(table => {
            const rows = table.querySelectorAll("tbody tr");
            rows.forEach(row => {
                if (row.cells.length > 1) { 
                    const text = row.innerText.toUpperCase();
                    row.style.display = text.includes(filter) ? '' : 'none';
                }
            });
        });
    }
</script>
@endsection