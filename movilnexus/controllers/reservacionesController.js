import { reservacionesService } from '../services/reservacionesService';

export const reservacionesController = {
  async cargarPorUsuario(idUsuario, { setLista, setLoading, setError }) {
    setLoading(true);
    setError('');
    try {
      const lista = await reservacionesService.porUsuario(idUsuario);
      setLista(lista);
    } catch (e) {
      setError(e.message || 'Error al cargar reservaciones');
    } finally {
      setLoading(false);
    }
  },

  async crear(idUsuario, datosReserva, { setLoading, setError, onSuccess }) {
    setLoading(true);
    setError('');
    try {
      const nueva = await reservacionesService.crear(idUsuario, datosReserva);
      onSuccess(nueva);
    } catch (e) {
      setError(e.message || 'Error al crear reservación');
    } finally {
      setLoading(false);
    }
  },
};

/*
const [inicio, fin] = horaSel.split(' - ');

// Función para asegurar el formato 00:00:00
const formatTime = (timeStr) => {
  const [h, m] = timeStr.split(':');
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
};

const datosReserva = {
  fecha: format(fechaSel, 'yyyy-MM-dd'),
  horaInicio: formatTime(inicio),
  horaFin: formatTime(fin),
  capacidad: espacioSel.capacidad,
  idEspacio: espacioSel.id_espacio,
  motivo: motivo
};
/*
await reservacionesController.crear(usuario.id_usuario, datosReserva, {
  setLoading,
  setError: setErrorGeneral,
  onSuccess: (nueva) => setReservaCreada(nueva)
});*/