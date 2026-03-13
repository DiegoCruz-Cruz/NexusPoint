<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

// Ruta para el Login
Route::get('/', [AdminController::class, 'login'])->name('login');

// Rutas del Panel de Administración
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/solicitudes', [AdminController::class, 'solicitudes'])->name('solicitudes');
    Route::get('/espacios', [AdminController::class, 'espacios'])->name('espacios');
    Route::get('/usuarios', [AdminController::class, 'usuarios'])->name('usuarios');
    Route::get('/reportes', [AdminController::class, 'reportes'])->name('reportes');
});