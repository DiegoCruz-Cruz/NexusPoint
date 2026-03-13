export default class Piso {
  constructor(data) {
    this.id_piso      = data.id_piso;
    this.numero_piso  = data.numero_piso;
    this.id_edificio  = data.id_edificio;
  }

  toJSON() { return { ...this }; }
  static fromJSON(json) { return new Piso(json); }
}