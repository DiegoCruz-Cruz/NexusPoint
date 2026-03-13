export default class Reservacion {
  constructor(data) {
    this.id_reservacion        = data.id_reservacion;
    this.folio_reservacion     = data.folio_reservacion;
    this.fecha_solicitud       = data.fecha_solicitud;
    this.fecha_reserva         = data.fecha_reserva;
    this.hora_inicio           = data.hora_inicio;
    this.hora_fin              = data.hora_fin;
    this.capacidad_solicitada  = data.capacidad_solicitada;
    this.motivo                = data.motivo;
    this.id_usuario            = data.id_usuario;
    this.id_espacio            = data.id_espacio;
    this.id_estado_reservacion = data.id_estado_reservacion;
  }

  toJSON() { return { ...this }; }
  static fromJSON(json) { return new Reservacion(json); }

  getEstadoTexto() {
    if (this.id_estado_reservacion === 1) return 'Pendiente';
    if (this.id_estado_reservacion === 2) return 'Aprobada';
    if (this.id_estado_reservacion === 3) return 'Rechazada';
    if (this.id_estado_reservacion === 4) return 'Cancelada';
    if (this.id_estado_reservacion === 5) return 'Finalizada';
    return 'Desconocido';
  }

  isPendiente()  { return this.id_estado_reservacion === 1; }
  isAprobada()   { return this.id_estado_reservacion === 2; }
  isRechazada()  { return this.id_estado_reservacion === 3; }
  isCancelada()  { return this.id_estado_reservacion === 4; }
  isFinalizada() { return this.id_estado_reservacion === 5; }

  getHorario() {
    return `${this.hora_inicio} - ${this.hora_fin}`;
  }
}