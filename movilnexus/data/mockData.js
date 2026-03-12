export const currentUser = {
  id:           'u001',
  matricula:    '22310045',
  nombre:       'Karen Mendes',
  carrera:      'Ing. TIC e Innovación Digital',
  cuatrimestre: 5,
  email:        'k.mendes@upq.edu.mx',
  rol:          'Alumno',
};

export const spaces = [
  { id:'s1',  nombre:'Laboratorio 1 - Edif. C', tipo:'Laboratorio Química',     capacidad:30, ubicacion:'Piso 1, Edificio C', estado:'disponible',  categoria:'laboratorio' },
  { id:'s2',  nombre:'Laboratorio 2 - Edif. C', tipo:'Laboratorio Química',     capacidad:30, ubicacion:'Piso 1, Edificio C', estado:'disponible',  categoria:'laboratorio' },
  { id:'s3',  nombre:'Laboratorio 3 - Edif. C', tipo:'Laboratorio Química',     capacidad:20, ubicacion:'Piso 2, Edificio C', estado:'reservado',   categoria:'laboratorio' },
  { id:'s4',  nombre:'Cubículo 1 - Edif. D',    tipo:'Atención Psicológica',    capacidad:1,  ubicacion:'Piso 1, Edif. D',    estado:'disponible',  categoria:'psicologia'  },
  { id:'s5',  nombre:'Cubículo 2 - Edif. D',    tipo:'Atención Psicológica',    capacidad:1,  ubicacion:'Piso 1, Edif. D',    estado:'reservado',   categoria:'psicologia'  },
  { id:'s6',  nombre:'Tutoría Individual',       tipo:'Asesoría 1 a 1',          capacidad:2,  ubicacion:'Piso 1, Edificio C', estado:'disponible',  categoria:'tutoria'     },
  { id:'s7',  nombre:'Tutoría Grupal',           tipo:'Tutoría grupal',          capacidad:30, ubicacion:'Piso 1, Edificio C', estado:'disponible',  categoria:'tutoria'     },
  { id:'s8',  nombre:'Cancha de Fútbol',         tipo:'Pasto Sintético',         capacidad:14, ubicacion:'Polideportivo A',    estado:'nodisponible',categoria:'canchas'     },
  { id:'s9',  nombre:'Cancha de Voleibol',       tipo:'Duela',                   capacidad:12, ubicacion:'Area Deportiva',     estado:'disponible',  categoria:'canchas'     },
  { id:'s10', nombre:'Centro de Cómputo A',      tipo:'Centro de Cómputo',       capacidad:30, ubicacion:'Piso 2, Edificio A', estado:'disponible',  categoria:'computo'     },
  { id:'s11', nombre:'Aula de Fotografía',       tipo:'Tornos y pedestales',     capacidad:30, ubicacion:'Edificio A, P.B.',   estado:'disponible',  categoria:'aulas'       },
  { id:'s12', nombre:'Aula de Dibujo',           tipo:'Caballetes e iluminación',capacidad:30, ubicacion:'Piso 1, CIDEA',      estado:'disponible',  categoria:'aulas'       },
];

export const categorias = [
  { id:'laboratorio', nombre:'Laboratorios'       },
  { id:'psicologia',  nombre:'Serv. Psicológico'  },
  { id:'aulas',       nombre:'Aulas'              },
  { id:'canchas',     nombre:'Canchas'            },
  { id:'tutoria',     nombre:'Tutorias'           },
  { id:'computo',     nombre:'Centro de Cómputo'  },
];

export const notificaciones = [
  { id:'n1', tipo:'info',    titulo:'Bienvenido, empecemos',          mensaje:'',                                 leida:false, acciones:false },
  { id:'n2', tipo:'confirm', titulo:'Reserva de Laboratorio Química', mensaje:'',                                 leida:false, acciones:true  },
  { id:'n3', tipo:'cancel',  titulo:'Cancelaste una reserva',         mensaje:'Centro de cómputo 1 - Edif. B',   leida:true,  acciones:false },
  { id:'n4', tipo:'done',    titulo:'Reserva terminada',              mensaje:'Cancha de fútbol - Pasto Sintetico', leida:true, acciones:false },
];

export const proximaReserva = {
  espacio:  'Sala de Conferencias B1',
  edificio: 'Edificio B',
  fecha:    'Lunes 2 Marzo',
  hora:     '10:00 - 11:40',
  estado:   'confirmada',
};