export default class Edificio {
  constructor(data) {
    this.id_edificio     = data.id_edificio;
    this.nombre_edificio = data.nombre_edificio;
    this.clave_edificio  = data.clave_edificio;
  }

  toJSON() { return { ...this }; }
  static fromJSON(json) { return new Edificio(json); }

  getNombreCompleto() {
    return `${this.nombre_edificio} (${this.clave_edificio})`;
  }
}