import { reservacionesService } from '../services/reservacionesService';

export const reservacionesController = {
  async cargarPorUsuario(idUsuario, { setLista, setLoading, setError }) {
    setLoading(true);
    try {
      const data = await reservacionesService.porUsuario(idUsuario);
      setLista(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  },

  async crear(idUsuario, formData, { setLoading, setError, onSuccess }) {
    setLoading(true);
    setError('');
    try {
      const nueva = await reservacionesService.crear(idUsuario, {
        fecha_reserva:       formData.fecha,       // "2026-03-18"
        hora_inicio:         formData.horaInicio,  // "14:00:00"
        hora_fin:            formData.horaFin,     // "15:40:00"
        capacidad_solicitada: formData.capacidad,
        motivo:              formData.motivo || '',
        id_espacio:          formData.idEspacio,
      });
      onSuccess(nueva);
    } catch (e) {
      setError(e.message || 'Error al crear la reservación');
    } finally {
      setLoading(false);
    }
  },

  async cancelar(idReservacion, { setLoading, setError, onSuccess }) {
    setLoading(true);
    try {
      await reservacionesService.cancelar(idReservacion);
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  },
};