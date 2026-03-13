<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function login() { return view('auth.login'); }
    public function dashboard() { return view('admin.dashboard'); }
    public function solicitudes() { return view('admin.solicitudes'); }
    public function espacios() { return view('admin.espacios'); }
    public function usuarios() { return view('admin.usuarios'); }
    public function reportes() { return view('admin.reportes'); }
}