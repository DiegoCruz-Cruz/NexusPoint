import User         from '../models/User';
import Space        from '../models/Space';
import Notificacion from '../models/Notificacion';
import Reservacion  from '../models/Reservacion';
import Edificio     from '../models/Edificio';
import Piso         from '../models/Piso';

// ── ROLES ────────────────────────────────────────────
export const roles = [
  { id_rol: 1, nombre_rol: 'Alumno'         },
  { id_rol: 2, nombre_rol: 'Docente'        },
  { id_rol: 3, nombre_rol: 'Encargado'      },
  { id_rol: 4, nombre_rol: 'Administrador'  },
];

// ── CARRERAS ─────────────────────────────────────────
export const carreras = [
  { id_carrera: 1, nombre_carrera: 'Ing. TIC e Innovación Digital', clave_carrera: 'ITICID' },
  { id_carrera: 2, nombre_carrera: 'Ing. en Mecatrónica',           clave_carrera: 'IMT'    },
  { id_carrera: 3, nombre_carrera: 'Ing. en Manufactura',           clave_carrera: 'IMA'    },
];

// ── USUARIO ACTUAL ────────────────────────────────────
export const currentUser = User.fromJSON({
  id_usuario:   1,
  matricula:    '22310045',
  nombre:       'Karen',
  apellido_p:   'Mendes',
  apellido_m:   'Iriarte',
  correo:       'k.mendes@upq.edu.mx',
  cuatrimestre: 5,
  id_rol:       1,
  id_carrera:   1,
});

// ── EDIFICIOS ─────────────────────────────────────────
export const edificios = [
  Edificio.fromJSON({ id_edificio: 1, nombre_edificio: 'Edificio A',      clave_edificio: 'A'      }),
  Edificio.fromJSON({ id_edificio: 2, nombre_edificio: 'Edificio B',      clave_edificio: 'B'      }),
  Edificio.fromJSON({ id_edificio: 3, nombre_edificio: 'Edificio C',      clave_edificio: 'C'      }),
  Edificio.fromJSON({ id_edificio: 4, nombre_edificio: 'Edificio D',      clave_edificio: 'D'      }),
  Edificio.fromJSON({ id_edificio: 5, nombre_edificio: 'CIDEA',           clave_edificio: 'CIDEA'  }),
  Edificio.fromJSON({ id_edificio: 6, nombre_edificio: 'Área Deportiva',  clave_edificio: 'DEP'    }),
  Edificio.fromJSON({ id_edificio: 7, nombre_edificio: 'Polideportivo A', clave_edificio: 'POLI-A' }),
];

// ── PISOS ─────────────────────────────────────────────
export const pisos = [
  Piso.fromJSON({ id_piso: 1,  numero_piso: 'Planta Baja', id_edificio: 1 }),
  Piso.fromJSON({ id_piso: 2,  numero_piso: 'Piso 1',      id_edificio: 1 }),
  Piso.fromJSON({ id_piso: 3,  numero_piso: 'Piso 2',      id_edificio: 1 }),
  Piso.fromJSON({ id_piso: 4,  numero_piso: 'Planta Baja', id_edificio: 2 }),
  Piso.fromJSON({ id_piso: 5,  numero_piso: 'Piso 1',      id_edificio: 2 }),
  Piso.fromJSON({ id_piso: 6,  numero_piso: 'Piso 2',      id_edificio: 2 }),
  Piso.fromJSON({ id_piso: 7,  numero_piso: 'Planta Baja', id_edificio: 3 }),
  Piso.fromJSON({ id_piso: 8,  numero_piso: 'Piso 1',      id_edificio: 3 }),
  Piso.fromJSON({ id_piso: 9,  numero_piso: 'Piso 2',      id_edificio: 3 }),
  Piso.fromJSON({ id_piso: 10, numero_piso: 'Piso 1',      id_edificio: 4 }),
  Piso.fromJSON({ id_piso: 11, numero_piso: 'Planta Baja', id_edificio: 5 }),
  Piso.fromJSON({ id_piso: 12, numero_piso: 'Área Principal', id_edificio: 6 }),
  Piso.fromJSON({ id_piso: 13, numero_piso: 'Área Principal', id_edificio: 7 }),
];

// ── TIPOS DE ESPACIO ──────────────────────────────────
export const tiposEspacio = [
  { id_tipo_espacio: 1, nombre_tipo_espacio: 'Laboratorio'          },
  { id_tipo_espacio: 2, nombre_tipo_espacio: 'Aula'                 },
  { id_tipo_espacio: 3, nombre_tipo_espacio: 'Cancha'               },
  { id_tipo_espacio: 4, nombre_tipo_espacio: 'Centro de Cómputo'    },
  { id_tipo_espacio: 5, nombre_tipo_espacio: 'Auditorio'            },
  { id_tipo_espacio: 6, nombre_tipo_espacio: 'Sala'                 },
  { id_tipo_espacio: 7, nombre_tipo_espacio: 'Servicio Psicológico' },
  { id_tipo_espacio: 8, nombre_tipo_espacio: 'Tutoría'              },
  { id_tipo_espacio: 9, nombre_tipo_espacio: 'Biblioteca'           },
];

// ── ESTADOS DE ESPACIO ────────────────────────────────
export const estadosEspacio = [
  { id_estado_espacio: 1, nombre_estado_espacio: 'Disponible'              },
  { id_estado_espacio: 2, nombre_estado_espacio: 'Reservado Temporalmente' },
  { id_estado_espacio: 3, nombre_estado_espacio: 'No Disponible'           },
];

// ── ESPACIOS ──────────────────────────────────────────
export const spaces = [
  Space.fromJSON({ id_espacio: 1,  codigo_espacio: 'C-LAB-01', nombre_espacio: 'Laboratorio 1 - Edif. C', descripcion_espacio: 'Laboratorio de Química',      capacidad: 30, id_tipo_espacio: 1, id_estado_espacio: 1, id_piso: 8  }),
  Space.fromJSON({ id_espacio: 2,  codigo_espacio: 'C-LAB-02', nombre_espacio: 'Laboratorio 2 - Edif. C', descripcion_espacio: 'Laboratorio de Química',      capacidad: 30, id_tipo_espacio: 1, id_estado_espacio: 1, id_piso: 8  }),
  Space.fromJSON({ id_espacio: 3,  codigo_espacio: 'C-LAB-03', nombre_espacio: 'Laboratorio 3 - Edif. C', descripcion_espacio: 'Laboratorio de Química',      capacidad: 20, id_tipo_espacio: 1, id_estado_espacio: 2, id_piso: 9  }),
  Space.fromJSON({ id_espacio: 4,  codigo_espacio: 'D-PSI-01', nombre_espacio: 'Cubículo 1 - Edif. D',    descripcion_espacio: 'Atención Psicológica',        capacidad: 1,  id_tipo_espacio: 7, id_estado_espacio: 1, id_piso: 10 }),
  Space.fromJSON({ id_espacio: 5,  codigo_espacio: 'D-PSI-02', nombre_espacio: 'Cubículo 2 - Edif. D',    descripcion_espacio: 'Atención Psicológica',        capacidad: 1,  id_tipo_espacio: 7, id_estado_espacio: 2, id_piso: 10 }),
  Space.fromJSON({ id_espacio: 6,  codigo_espacio: 'C-TUT-01', nombre_espacio: 'Tutoría Individual',      descripcion_espacio: 'Asesoría 1 a 1',              capacidad: 2,  id_tipo_espacio: 8, id_estado_espacio: 1, id_piso: 8  }),
  Space.fromJSON({ id_espacio: 7,  codigo_espacio: 'C-TUT-02', nombre_espacio: 'Tutoría Grupal',          descripcion_espacio: 'Tutoría grupal',              capacidad: 30, id_tipo_espacio: 8, id_estado_espacio: 1, id_piso: 8  }),
  Space.fromJSON({ id_espacio: 8,  codigo_espacio: 'DEP-FUT',  nombre_espacio: 'Cancha de Fútbol',        descripcion_espacio: 'Pasto Sintético',             capacidad: 14, id_tipo_espacio: 3, id_estado_espacio: 3, id_piso: 13 }),
  Space.fromJSON({ id_espacio: 9,  codigo_espacio: 'DEP-VOL',  nombre_espacio: 'Cancha de Voleibol',      descripcion_espacio: 'Duela',                       capacidad: 12, id_tipo_espacio: 3, id_estado_espacio: 1, id_piso: 12 }),
  Space.fromJSON({ id_espacio: 10, codigo_espacio: 'A-COM-01', nombre_espacio: 'Centro de Cómputo A',     descripcion_espacio: 'Centro de Cómputo',           capacidad: 30, id_tipo_espacio: 4, id_estado_espacio: 1, id_piso: 3  }),
  Space.fromJSON({ id_espacio: 11, codigo_espacio: 'CID-FOT',  nombre_espacio: 'Aula de Fotografía',      descripcion_espacio: 'Tornos y pedestales',         capacidad: 30, id_tipo_espacio: 2, id_estado_espacio: 1, id_piso: 11 }),
  Space.fromJSON({ id_espacio: 12, codigo_espacio: 'CID-DIB',  nombre_espacio: 'Aula de Dibujo',          descripcion_espacio: 'Caballetes e iluminación',    capacidad: 30, id_tipo_espacio: 2, id_estado_espacio: 1, id_piso: 11 }),
];

// ── ESTADOS DE RESERVACION ────────────────────────────
export const estadosReservacion = [
  { id_estado_reservacion: 1, nombre_estado_reservacion: 'Pendiente'  },
  { id_estado_reservacion: 2, nombre_estado_reservacion: 'Aprobada'   },
  { id_estado_reservacion: 3, nombre_estado_reservacion: 'Rechazada'  },
  { id_estado_reservacion: 4, nombre_estado_reservacion: 'Cancelada'  },
  { id_estado_reservacion: 5, nombre_estado_reservacion: 'Finalizada' },
];

// ── RESERVACIONES ─────────────────────────────────────
export const reservaciones = [
  Reservacion.fromJSON({
    id_reservacion:        1,
    folio_reservacion:     'RES-2026-001',
    fecha_solicitud:       '2026-03-01 10:00:00',
    fecha_reserva:         '2026-03-02',
    hora_inicio:           '10:00:00',
    hora_fin:              '11:40:00',
    capacidad_solicitada:  5,
    motivo:                'Práctica de laboratorio',
    id_usuario:            1,
    id_espacio:            1,
    id_estado_reservacion: 2,
  }),
  Reservacion.fromJSON({
    id_reservacion:        2,
    folio_reservacion:     'RES-2026-002',
    fecha_solicitud:       '2026-03-01 11:00:00',
    fecha_reserva:         '2026-03-02',
    hora_inicio:           '14:00:00',
    hora_fin:              '15:40:00',
    capacidad_solicitada:  1,
    motivo:                'Asesoría psicológica',
    id_usuario:            1,
    id_espacio:            4,
    id_estado_reservacion: 1,
  }),
];

// ── PROXIMA RESERVA ───────────────────────────────────
export const proximaReserva = reservaciones[0];

// ── NOTIFICACIONES ────────────────────────────────────
export const notificaciones = [
  Notificacion.fromJSON({
    id_notificacion:      1,
    id_usuario_destino:   1,
    id_reservacion:       null,
    id_tipo_notificacion: 4,
    titulo_notificacion:  'Bienvenido a NexusPoint',
    cuerpo_notificacion:  'Empieza a reservar espacios ahora',
    leida:                0,
    fecha_envio:          '2026-03-01 08:00:00',
  }),
  Notificacion.fromJSON({
    id_notificacion:      2,
    id_usuario_destino:   1,
    id_reservacion:       1,
    id_tipo_notificacion: 1,
    titulo_notificacion:  'Reserva de Laboratorio aprobada',
    cuerpo_notificacion:  'Tu reserva RES-2026-001 fue aprobada',
    leida:                0,
    fecha_envio:          '2026-03-01 10:30:00',
  }),
  Notificacion.fromJSON({
    id_notificacion:      3,
    id_usuario_destino:   1,
    id_reservacion:       2,
    id_tipo_notificacion: 3,
    titulo_notificacion:  'Cancelaste una reserva',
    cuerpo_notificacion:  'Centro de cómputo 1 - Edif. B',
    leida:                1,
    fecha_envio:          '2026-03-01 12:00:00',
  }),
  Notificacion.fromJSON({
    id_notificacion:      4,
    id_usuario_destino:   1,
    id_reservacion:       1,
    id_tipo_notificacion: 5,
    titulo_notificacion:  'Reserva terminada',
    cuerpo_notificacion:  'Cancha de futbol - Pasto Sintetico',
    leida:                1,
    fecha_envio:          '2026-03-02 12:00:00',
  }),
];