export default class User {
  constructor(data) {
    this.id_usuario   = data.id_usuario;
    this.matricula    = data.matricula;
    this.nombre       = data.nombre;
    this.apellido_p   = data.apellido_p;
    this.apellido_m   = data.apellido_m;
    this.correo       = data.correo;
    this.cuatrimestre = data.cuatrimestre;
    this.id_rol       = data.id_rol;
    this.id_carrera   = data.id_carrera;
  }

  toJSON() { return { ...this }; }
  static fromJSON(json) { return new User(json); }

  getNombreCompleto() {
    return `${this.nombre} ${this.apellido_p} ${this.apellido_m || ''}`.trim();
  }

  getNombreCorto() {
    return this.nombre;
  }

  getInitiales() {
    return `${this.nombre[0]}${this.apellido_p[0]}`.toUpperCase();
  }
}