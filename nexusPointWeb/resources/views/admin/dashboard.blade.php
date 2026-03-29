@extends('layouts.app')

@section('titulo', 'Dashboard')

@section('head')
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
@endsection

@section('contenido')
    <header class="section-header">
        <h1>Panel de <span class="text-primario">Estadísticas</span></h1>
        <p>Bienvenido al sistema de gestión NexusPoint</p>
    </header>

    {{-- Tarjetas de estadísticas --}}
    <section class="stats-grid">
        <div class="stat-card">
            <h3>Solicitudes Totales</h3>
            <p class="stat-number">{{ $totalSolicitudes > 0 ? number_format($totalSolicitudes) : '—' }}</p>
            <span class="stat-desc">{{ $totalSolicitudes > 0 ? 'En el sistema' : 'Sin solicitudes aún' }}</span>
        </div>
        <div class="stat-card">
            <h3>Espacios Activos</h3>
            <p class="stat-number">{{ $espaciosActivos > 0 ? $espaciosActivos : '—' }}</p>
            <span class="stat-desc">{{ $espaciosActivos > 0 ? 'En toda la institución' : 'Sin espacios aún' }}</span>
        </div>
        <div class="stat-card">
            <h3>Aprobación</h3>
            <p class="stat-number">{{ $totalSolicitudes > 0 ? $tasaAprobacion . '%' : '—' }}</p>
            <span class="stat-desc">{{ $totalSolicitudes > 0 ? 'Tasa de éxito' : 'Sin datos aún' }}</span>
        </div>
    </section>

    {{-- Gráficas --}}
    <section class="charts-section">
        <div class="chart-container">
            <h3>Días con más solicitudes</h3>
            @if($totalSolicitudes > 0)
                <canvas id="barChart"></canvas>
            @else
                <p style="color: #aaa; font-size: 0.9rem; margin-top: 12px;">No hay solicitudes registradas todavía.</p>
            @endif
        </div>
        <div class="chart-container">
            <h3>Ocupación por Edificio</h3>
            @if(count($ocupacionEdificios) > 0)
                <div class="pie-wrapper">
                    <canvas id="pieChart"></canvas>
                </div>
            @else
                <p style="color: #aaa; font-size: 0.9rem; margin-top: 12px;">No hay edificios registrados todavía.</p>
            @endif
        </div>
    </section>

    {{-- Reportes --}}
    <section class="reports-section">
        <div class="report-card">
            <div class="report-info">
                <h3>Historial Mensual — {{ \Carbon\Carbon::now()->locale('es')->isoFormat('MMMM YYYY') }}</h3>
                <p>{{ $totalSolicitudes > 0 ? 'Reporte completo de todas las solicitudes, ocupación y estadísticas del mes.' : 'No hay datos suficientes para generar un reporte este mes.' }}</p>
            </div>
            <button class="btn-download" {{ $totalSolicitudes == 0 ? 'disabled' : '' }}
                    style="{{ $totalSolicitudes == 0 ? 'opacity:0.5; cursor:not-allowed;' : '' }}">
                Exportar Reporte (PDF)
            </button>
        </div>
    </section>
@endsection

@section('scripts')
    <script>
        const barData = {
            labels: {!! json_encode(array_keys($diasSemana)) !!},
            values: {!! json_encode(array_values($diasSemana)) !!}
        };
        const pieData = {
            labels: {!! json_encode(array_keys($ocupacionEdificios)) !!},
            values: {!! json_encode(array_values($ocupacionEdificios)) !!}
        };
    </script>
    <script src="{{ asset('js/dashboard.js') }}"></script>
@endsection