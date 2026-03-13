export default class Notificacion {
  constructor(data) {
    this.id_notificacion      = data.id_notificacion;
    this.id_usuario_destino   = data.id_usuario_destino;
    this.id_reservacion       = data.id_reservacion;
    this.id_tipo_notificacion = data.id_tipo_notificacion;
    this.titulo_notificacion  = data.titulo_notificacion;
    this.cuerpo_notificacion  = data.cuerpo_notificacion;
    this.leida                = data.leida;
    this.fecha_envio          = data.fecha_envio;
  }

  toJSON() { return { ...this }; }
  static fromJSON(json) { return new Notificacion(json); }

  getTipoTexto() {
    if (this.id_tipo_notificacion === 1) return 'Aprobacion';
    if (this.id_tipo_notificacion === 2) return 'Rechazo';
    if (this.id_tipo_notificacion === 3) return 'Cancelacion';
    if (this.id_tipo_notificacion === 4) return 'Sistema';
    if (this.id_tipo_notificacion === 5) return 'Recordatorio';
    return 'Desconocido';
  }

  isLeida() {
    return this.leida === 1;
  }
}