export default class Space {
  constructor(data) {
    this.id_espacio        = data.id_espacio;
    this.codigo_espacio    = data.codigo_espacio;
    this.nombre_espacio    = data.nombre_espacio;
    this.descripcion_espacio = data.descripcion_espacio;
    this.capacidad         = data.capacidad;
    this.id_tipo_espacio   = data.id_tipo_espacio;
    this.id_estado_espacio = data.id_estado_espacio;
    this.id_piso           = data.id_piso;
  }

  toJSON() { return { ...this }; }
  static fromJSON(json) { return new Space(json); }

  isDisponible() {
    return this.id_estado_espacio === 1;
  }

  isReservado() {
    return this.id_estado_espacio === 2;
  }

  isNoDisponible() {
    return this.id_estado_espacio === 3;
  }

  getEstadoTexto() {
    if (this.id_estado_espacio === 1) return 'Disponible';
    if (this.id_estado_espacio === 2) return 'Reservado Temporalmente';
    if (this.id_estado_espacio === 3) return 'No Disponible';
    return 'Desconocido';
  }
}