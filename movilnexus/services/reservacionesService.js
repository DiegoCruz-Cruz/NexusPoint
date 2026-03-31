

import { api } from './api';

export const reservacionesService = {
  // GET /reservaciones/
  // retorna: ReservacionOut[]  (todas — solo admin/encargado)
  listarTodas() {
    return api.get('/reservaciones/');
  },

  // GET /reservaciones/{id_reservacion}
  // retorna: ReservacionOut  (404 si no existe)
  obtener(idReservacion) {
    return api.get(`/reservaciones/${idReservacion}`);
  },

  // GET /reservaciones/usuario/{id_usuario}
  // retorna: ReservacionOut[]  — historial del alumno
  porUsuario(idUsuario) {
    return api.get(`/reservaciones/usuario/${idUsuario}`);
  },

  // GET /reservaciones/estado/{id_estado}
  // retorna: ReservacionOut[]  — filtra por estado
  porEstado(idEstado) {
    return api.get(`/reservaciones/estado/${idEstado}`);
  },

  async crear(idUsuario, payload) {
    // Según tu Swagger, la ruta es /reservaciones/{id_usuario}
    return await api.post(`/reservaciones/${idUsuario}`, payload); 
  },
  

  // PUT /reservaciones/{id_reservacion}/cancelar
  // Solo cancela si estado es 1 (Pendiente) o 2 (Aprobada)
  // El router libera el espacio (→ Disponible) y crea notificación
  // retorna: ReservacionOut
  cancelar(idReservacion) {
    return api.put(`/reservaciones/${idReservacion}/cancelar`);
  },

  // POST /reservaciones/gestionar
  // body: GestionCreate
  //   id_reservacion:        number
  //   id_estado_reservacion: number  (2=Aprobar, 3=Rechazar)
  //   observaciones?:        string
  //
  // El router registra en tabla gestion y notifica al solicitante
  // Solo encargado/admin
  // retorna: GestionOut (201)
  //   id_gestion  id_reservacion  id_usuario_gestor
  //   fecha_gestion?  id_estado_reservacion  observaciones?
  gestionar(payload) {
    return api.post('/reservaciones/gestionar', payload);
  },
  
  listarEspaciosPorTipo(idTipo) {
    return api.get(`/espacios/tipo/${idTipo}`);
  }

};
