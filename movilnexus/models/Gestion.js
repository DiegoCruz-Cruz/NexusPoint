export default class Gestion {
  constructor(data) {
    this.id_gestion            = data.id_gestion;
    this.id_reservacion        = data.id_reservacion;
    this.id_usuario_gestor     = data.id_usuario_gestor;
    this.fecha_gestion         = data.fecha_gestion;
    this.id_estado_reservacion = data.id_estado_reservacion;
    this.observaciones         = data.observaciones;
  }

  toJSON() { return { ...this }; }
  static fromJSON(json) { return new Gestion(json); }

  getEstadoTexto() {
    if (this.id_estado_reservacion === 1) return 'Pendiente';
    if (this.id_estado_reservacion === 2) return 'Aprobada';
    if (this.id_estado_reservacion === 3) return 'Rechazada';
    if (this.id_estado_reservacion === 4) return 'Cancelada';
    if (this.id_estado_reservacion === 5) return 'Finalizada';
    return 'Desconocido';
  }
}