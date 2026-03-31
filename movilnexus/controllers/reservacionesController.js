// ─────────────────────────────────────────────────────
// controllers/reservacionesController.js — Corregido
// El método crear ya NO transforma el payload;
// la pantalla le entrega directamente el objeto
// ReservacionCreate con los nombres de campos correctos.
// ─────────────────────────────────────────────────────

import { reservacionesService } from '../services/reservacionesService';

export const reservacionesController = {

  // Carga el historial de reservaciones de un usuario
  async cargarPorUsuario(idUsuario, { setLista, setLoading, setError }) {
    setLoading(true);
    setError('');
    try {
      const lista = await reservacionesService.porUsuario(idUsuario);
      // Ordenar: más recientes primero
      const ordenada = [...lista].sort(
        (a, b) => new Date(b.fecha_solicitud ?? 0) - new Date(a.fecha_solicitud ?? 0)
      );
      setLista(ordenada);
    } catch (e) {
      setError(e.message || 'Error al cargar reservaciones');
    } finally {
      setLoading(false);
    }
  },

  // Crea una nueva reservación.
  // El payload ya viene con los nombres de campo correctos
  // (fecha_reserva, hora_inicio, hora_fin, id_espacio, …)
  async crear(idUsuario, payload, { setLoading, setError, onSuccess }) {
    setLoading(true);
    setError('');
    try {
      const nueva = await reservacionesService.crear(idUsuario, payload);
      onSuccess(nueva);
    } catch (e) {
      setError(e.message || 'Error al crear la reservación');
    } finally {
      setLoading(false);
    }
  },
};
