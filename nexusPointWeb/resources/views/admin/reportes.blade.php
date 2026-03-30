@extends('layouts.app')

@section('titulo', 'Reportes')

@section('contenido')
<header class="section-header">
    <h1>Reportes y <span class="text-primario">Exportaciones</span></h1>
    <p style="color:var(--color-secundario)">Descarga informes detallados y analiza el rendimiento.</p>
</header>

<section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin-top:20px;">
    @php
        $reportesRapidos = [
            ['titulo' => 'Reporte Mensual de Solicitudes',
             'desc'   => 'Historial completo de todas las solicitudes realizadas por docentes y personal.',
             'periodo'=> 'Periodo: ' . \Carbon\Carbon::now()->locale('es')->isoFormat('MMMM YYYY')],
            ['titulo' => 'Ocupación por Edificio',
             'desc'   => 'Estadísticas detalladas de uso, horas pico y ocupación por niveles académicos.',
             'periodo'=> 'Periodo: ' . \Carbon\Carbon::now()->year . ' — Q' . \Carbon\Carbon::now()->quarter],
            ['titulo' => 'Análisis de Tendencias',
             'desc'   => 'Patrones de uso y predicciones basadas en datos históricos.',
             'periodo'=> 'Periodo: ' . \Carbon\Carbon::now()->locale('es')->isoFormat('MMMM YYYY')],
        ];
    @endphp

    @foreach($reportesRapidos as $r)
    <div style="background:white; padding:25px; border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.05); display:flex; flex-direction:column; justify-content:space-between; border-top:4px solid var(--color-primario); transition:transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform=''">
        <div>
            <h3 style="color:var(--color-secundario); margin-bottom:10px; font-size:1.1rem;">{{ $r['titulo'] }}</h3>
            <p style="font-size:0.9rem; color:#666; margin-bottom:15px; line-height:1.4;">{{ $r['desc'] }}</p>
            <span style="font-size:0.75rem; font-weight:700; color:var(--color-primario); text-transform:uppercase;">{{ $r['periodo'] }}</span>
        </div>
        <button onclick="showCreatedModal()"
            style="margin-top:20px; background:#f0f4f8; color:var(--color-secundario); border:1px solid #d1d9e0; padding:8px 15px; border-radius:6px; font-weight:600; font-size:0.85rem; cursor:pointer;">
            Exportar PDF
        </button>
    </div>
    @endforeach
</section>

<section class="form-container-white" style="margin-top:40px;">
    <h2 style="margin-bottom:20px; color:var(--color-secundario);">Generar Reporte Personalizado</h2>
    <form class="grid-form" onsubmit="event.preventDefault(); showCreatedModal();">
        <div class="input-group">
            <label>Tipo de Reporte</label>
            <select class="custom-select">
                <option>Solicitudes por Usuario</option>
                <option>Uso de Laboratorios</option>
                <option>Inventario de Equipamiento</option>
                <option>Incidencias Reportadas</option>
            </select>
        </div>
        <div class="input-group">
            <label>Formato de Salida</label>
            <select class="custom-select">
                <option>PDF (.pdf)</option>
                <option>Excel (.xlsx)</option>
                <option>CSV (.csv)</option>
            </select>
        </div>
        <div class="input-group">
            <label>Fecha Inicio</label>
            <input type="date">
        </div>
        <div class="input-group">
            <label>Fecha Fin</label>
            <input type="date">
        </div>
        <div class="form-actions" style="grid-column:span 2; display:flex; justify-content:center; margin-top:20px;">
            <button type="submit"
                style="display:inline-flex; align-items:center; background:var(--color-secundario); color:white; padding:12px 30px; border-radius:50px; border:2px solid var(--color-primario); font-weight:700; cursor:pointer;">
                Generar Reporte
            </button>
        </div>
    </form>
</section>

{{-- Modal --}}
<div id="modalReporte" class="modal-overlay" style="display:none;">
    <div class="modal-content">
        <h3 style="color:var(--color-secundario); margin-bottom:15px;">Reporte Creado</h3>
        <p style="color:#666; margin-bottom:20px;">El reporte se ha generado correctamente y está listo para descargar.</p>
        <button onclick="document.getElementById('modalReporte').style.display='none'"
            style="display:inline-flex; align-items:center; background:var(--color-secundario); color:white; padding:12px 30px; border-radius:50px; border:2px solid var(--color-primario); font-weight:700; cursor:pointer;">
            Aceptar
        </button>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function showCreatedModal() {
        document.getElementById('modalReporte').style.display = 'flex';
    }
</script>
@endsection
