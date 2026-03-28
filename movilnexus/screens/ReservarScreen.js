import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadows } from '../constants/theme';


// ── DATOS ────────────────────────────────────────────
const categorias = [
  { id_tipo_espacio: 7, nombre: 'Servicio\nPsicológico', icon: 'body-outline'     },
  { id_tipo_espacio: 8, nombre: 'Tutoria',               icon: 'school-outline'   },
  { id_tipo_espacio: 2, nombre: 'Aulas',                 icon: 'easel-outline'    },
  { id_tipo_espacio: 1, nombre: 'Laboratorios',          icon: 'flask-outline'    },
  { id_tipo_espacio: 3, nombre: 'Canchas',               icon: 'football-outline' },
  { id_tipo_espacio: 4, nombre: 'Centro de\ncómputo',    icon: 'desktop-outline'  },
];

const horarios = [
  '7:00 - 8:40',   '8:40 - 10:20',  '10:20 - 12:00',
  '12:00 - 13:40', '14:00 - 15:40', '15:40 - 17:20',
];

const capacidades = [1, 2, 3, 5, 10, 15, 20, 30];

const diasMes = [
  '',  30,  1,  2,  3,  1,  2,
   3,   4,  5,  6,  7,  8,  9,
  10,  11, 12, 13, 14, 15, 16,
  17,  18, 19, 20, 21, 22, 23,
  24,  25, 26, 27, 28, 29, 30,
];

// ── COMPONENTE ───────────────────────────────────────
export default function ReservarScreen() {
  const [categoriaActiva,       setCategoriaActiva]       = useState(null);
  const [modalVisible,          setModalVisible]          = useState(false);
  const [espacioSeleccionado,   setEspacioSeleccionado]   = useState(null);
  const [diaSeleccionado,       setDiaSeleccionado]       = useState(18);
  const [horarioSeleccionado,   setHorarioSeleccionado]   = useState(horarios[4]);
  const [capacidadSeleccionada, setCapacidadSeleccionada] = useState(1);
  const [showEspacios,          setShowEspacios]          = useState(false);
  const [showHorarios,          setShowHorarios]          = useState(false);
  const [showCapacidades,       setShowCapacidades]       = useState(false);
  const [reservaExitosa,        setReservaExitosa]        = useState(false);

  const espaciosFiltrados = spaces.filter(
    s => s.id_tipo_espacio === categoriaActiva?.id_tipo_espacio
  );

  const espaciosDisponibles = spaces.filter(
    s => s.id_estado_espacio === 1
  );

  const cerrarTodoDropdown = () => {
    setShowEspacios(false);
    setShowHorarios(false);
    setShowCapacidades(false);
  };

  const abrirModal = (espacio = null) => {
    setEspacioSeleccionado(espacio);
    setReservaExitosa(false);
    cerrarTodoDropdown();
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setReservaExitosa(false);
    cerrarTodoDropdown();
  };

  const confirmarReserva = () => {
    if (!espacioSeleccionado) {
      setShowEspacios(true);
      return;
    }
    setReservaExitosa(true);
    cerrarTodoDropdown();
  };

  // ── MODAL ─────────────────────────────────────────
  const renderModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={cerrarModal}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={cerrarModal}
      >
        <TouchableOpacity style={styles.modalSheet} activeOpacity={1}>

          {/* Handle */}
          <View style={styles.modalHandle}/>

          {/* Botón cerrar */}
          <TouchableOpacity style={styles.btnCerrar} onPress={cerrarModal}>
            <Ionicons name="close" size={20} color={Colors.textMuted}/>
          </TouchableOpacity>

          {reservaExitosa ? (
            // ── PANTALLA ÉXITO ──────────────────────
            <View style={styles.exitoWrap}>
              <Ionicons name="checkmark-circle" size={80} color={Colors.cyan}/>
              <Text style={styles.exitoTitulo}>¡Reserva con Éxito!</Text>
              <Text style={styles.exitoSub}>
                Tu reserva ha sido registrada correctamente.
              </Text>
              <View style={styles.resumenCard}>
                <Text style={styles.resumenTitulo}>Resumen de Reserva</Text>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenKey}>Fecha</Text>
                  <Text style={styles.resumenVal}>{diaSeleccionado} marzo 2026</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenKey}>Hora</Text>
                  <Text style={styles.resumenVal}>{horarioSeleccionado}</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenKey}>Espacio</Text>
                  <Text style={styles.resumenVal}>{espacioSeleccionado?.nombre_espacio}</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenKey}>Capacidad</Text>
                  <Text style={styles.resumenVal}>{capacidadSeleccionada} persona(s)</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.btnConfirmar} onPress={cerrarModal}>
                <Text style={styles.btnConfirmarTexto}>Listo</Text>
              </TouchableOpacity>
            </View>

          ) : (
            // ── FORMULARIO ──────────────────────────
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {/* Título */}
              <Text style={styles.modalTitulo}>Nueva Reserva</Text>
              <Text style={styles.modalSub}>
                Selecciona el espacio, fecha y horario
              </Text>

              {/* ── Selector de espacio ── */}
              <Text style={styles.inputLabel}>Espacio</Text>
              <TouchableOpacity
                style={[
                  styles.selectorBox,
                  showEspacios && styles.selectorBoxActivo,
                ]}
                onPress={() => {
                  setShowEspacios(!showEspacios);
                  setShowHorarios(false);
                  setShowCapacidades(false);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.selectorValor,
                    !espacioSeleccionado && { color: Colors.textMuted },
                  ]}>
                    {espacioSeleccionado?.nombre_espacio || 'Selecciona un espacio'}
                  </Text>
                  {espacioSeleccionado && (
                    <Text style={styles.selectorSub}>
                      {espacioSeleccionado.descripcion_espacio} · Cap. {espacioSeleccionado.capacidad}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name={showEspacios ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>

              {showEspacios && (
                <View style={styles.dropdownBox}>
                  <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                    {espaciosDisponibles.map(s => (
                      <TouchableOpacity
                        key={s.id_espacio}
                        style={[
                          styles.dropdownItem,
                          espacioSeleccionado?.id_espacio === s.id_espacio &&
                            styles.dropdownItemActivo,
                        ]}
                        onPress={() => {
                          setEspacioSeleccionado(s);
                          setShowEspacios(false);
                        }}
                      >
                        <View style={styles.dropdownItemIcon}>
                          <Ionicons
                            name="location-outline"
                            size={16}
                            color={Colors.cyan}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.dropdownItemNombre}>
                            {s.nombre_espacio}
                          </Text>
                          <Text style={styles.dropdownItemDesc}>
                            {s.descripcion_espacio} · Cap. {s.capacidad}
                          </Text>
                        </View>
                        {espacioSeleccionado?.id_espacio === s.id_espacio && (
                          <Ionicons name="checkmark" size={18} color={Colors.cyan}/>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* ── Calendario ── */}
              <Text style={styles.inputLabel}>Fecha</Text>
              <View style={styles.calendario}>
                <View style={styles.calHeader}>
                  <TouchableOpacity style={styles.calBtn}>
                    <Ionicons name="chevron-back" size={20} color={Colors.bg}/>
                  </TouchableOpacity>
                  <Text style={styles.calMes}>Marzo 2026</Text>
                  <TouchableOpacity style={styles.calBtn}>
                    <Ionicons name="chevron-forward" size={20} color={Colors.bg}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.calDiasRow}>
                  {['D','L','M','M','J','V','S'].map((d, i) => (
                    <Text key={i} style={styles.calDiaLabel}>{d}</Text>
                  ))}
                </View>
                <View style={styles.calNumerosGrid}>
                  {diasMes.map((dia, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.calDia,
                        dia === diaSeleccionado && styles.calDiaActivo,
                      ]}
                      onPress={() => dia && setDiaSeleccionado(dia)}
                      disabled={!dia}
                    >
                      <Text style={[
                        styles.calDiaTexto,
                        dia === diaSeleccionado && styles.calDiaActivoTexto,
                        !dia && { opacity: 0 },
                      ]}>
                        {dia}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* ── Selectores horario y capacidad ── */}
              <View style={styles.selectoresRow}>

                {/* Horario */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Horario</Text>
                  <TouchableOpacity
                    style={[
                      styles.selectorBox,
                      showHorarios && styles.selectorBoxActivo,
                    ]}
                    onPress={() => {
                      setShowHorarios(!showHorarios);
                      setShowEspacios(false);
                      setShowCapacidades(false);
                    }}
                  >
                    <Text style={styles.selectorValor}>{horarioSeleccionado}</Text>
                    <Ionicons
                      name={showHorarios ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                  {showHorarios && (
                    <View style={styles.dropdownBox}>
                      {horarios.map(h => (
                        <TouchableOpacity
                          key={h}
                          style={[
                            styles.dropdownItem,
                            horarioSeleccionado === h && styles.dropdownItemActivo,
                          ]}
                          onPress={() => {
                            setHorarioSeleccionado(h);
                            setShowHorarios(false);
                          }}
                        >
                          <Text style={styles.dropdownItemNombre}>{h}</Text>
                          {horarioSeleccionado === h && (
                            <Ionicons name="checkmark" size={16} color={Colors.cyan}/>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Capacidad */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Personas</Text>
                  <TouchableOpacity
                    style={[
                      styles.selectorBox,
                      showCapacidades && styles.selectorBoxActivo,
                    ]}
                    onPress={() => {
                      setShowCapacidades(!showCapacidades);
                      setShowEspacios(false);
                      setShowHorarios(false);
                    }}
                  >
                    <Text style={styles.selectorValor}>{capacidadSeleccionada}</Text>
                    <Ionicons
                      name={showCapacidades ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                  {showCapacidades && (
                    <View style={styles.dropdownBox}>
                      {capacidades.map(c => (
                        <TouchableOpacity
                          key={c}
                          style={[
                            styles.dropdownItem,
                            capacidadSeleccionada === c && styles.dropdownItemActivo,
                          ]}
                          onPress={() => {
                            setCapacidadSeleccionada(c);
                            setShowCapacidades(false);
                          }}
                        >
                          <Text style={styles.dropdownItemNombre}>{c} persona(s)</Text>
                          {capacidadSeleccionada === c && (
                            <Ionicons name="checkmark" size={16} color={Colors.cyan}/>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

              </View>

              {/* ── Resumen ── */}
              <View style={styles.resumenCard}>
                <Text style={styles.resumenTitulo}>Resumen de Reserva</Text>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenKey}>Fecha</Text>
                  <Text style={styles.resumenVal}>{diaSeleccionado} marzo 2026</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenKey}>Hora</Text>
                  <Text style={styles.resumenVal}>{horarioSeleccionado}</Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenKey}>Espacio</Text>
                  <Text style={styles.resumenVal}>
                    {espacioSeleccionado?.nombre_espacio || 'Sin seleccionar'}
                  </Text>
                </View>
                <View style={styles.resumenFila}>
                  <Text style={styles.resumenKey}>Capacidad</Text>
                  <Text style={styles.resumenVal}>{capacidadSeleccionada} persona(s)</Text>
                </View>
              </View>

              {/* ── Botón confirmar ── */}
              <TouchableOpacity
                style={[
                  styles.btnConfirmar,
                  !espacioSeleccionado && styles.btnConfirmarDisabled,
                ]}
                onPress={confirmarReserva}
              >
                <Text style={styles.btnConfirmarTexto}>
                  {espacioSeleccionado ? 'Confirmar Reserva' : 'Selecciona un espacio'}
                </Text>
              </TouchableOpacity>

            </ScrollView>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  // ── VISTA: Lista de espacios ──────────────────────
  if (categoriaActiva) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btnRegresar}
            onPress={() => setCategoriaActiva(null)}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.bg}/>
          </TouchableOpacity>
          <Text style={styles.titulo}>
            {categoriaActiva.nombre.replace('\n', ' ')}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        >
          {espaciosFiltrados.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={Colors.textMuted}/>
              <Text style={styles.emptyTexto}>Sin espacios disponibles</Text>
            </View>
          ) : (
            espaciosFiltrados.map(espacio => (
              <View key={espacio.id_espacio} style={styles.espacioCard}>
                <View style={styles.espacioIcono}>
                  <Ionicons
                    name={categoriaActiva.icon}
                    size={28}
                    color={Colors.cyan}
                  />
                </View>
                <View style={styles.espacioInfo}>
                  <Text style={styles.espacioNombre}>{espacio.nombre_espacio}</Text>
                  <Text style={styles.espacioDesc}>{espacio.descripcion_espacio}</Text>
                  <Text style={styles.espacioCap}>
                    Capacidad: {espacio.capacidad} personas
                  </Text>
                  <View style={styles.estadoRow}>
                    <View style={[
                      styles.estadoDot,
                      espacio.id_estado_espacio === 1 && styles.dotVerde,
                      espacio.id_estado_espacio === 2 && styles.dotNaranja,
                      espacio.id_estado_espacio === 3 && styles.dotRojo,
                    ]}/>
                    <Text style={[
                      styles.estadoTexto,
                      espacio.id_estado_espacio === 1 && { color: Colors.success },
                      espacio.id_estado_espacio === 2 && { color: Colors.warning },
                      espacio.id_estado_espacio === 3 && { color: Colors.danger  },
                    ]}>
                      {espacio.getEstadoTexto()}
                    </Text>
                  </View>
                </View>
                
              </View>
            ))
          )}
        </ScrollView>

        {/* Botón flotante + */}
        <TouchableOpacity
          style={styles.btnFlotante}
          onPress={() => abrirModal(null)}
        >
          <Ionicons name="add" size={30} color={Colors.white}/>
        </TouchableOpacity>

        {renderModal()}
      </View>
    );
  }

  // ── VISTA: Grid de categorías ─────────────────────
  return (
    <View style={styles.container}>


      <View style={styles.header}>
        
        <Ionicons name="calendar-outline" size={26} color={Colors.cyan}/>
        <Text style={styles.titulo}>Espacios y Servicios</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {categorias.map(cat => (
          <TouchableOpacity
            key={cat.id_tipo_espacio}
            style={styles.catCard}
            activeOpacity={0.8}
            onPress={() => setCategoriaActiva(cat)}
          >
            <LinearGradient
              colors={['#00BCD4', '#004D8C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradiente}
            >
              <View style={styles.iconoWrap}>
                <Ionicons name={cat.icon} size={42} color={Colors.white}/>
              </View>
              <Text style={styles.catNombre}>{cat.nombre}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ── ESTILOS ───────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.white,
  },

  // Header
  header: {
    marginTop:         24,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    paddingTop:        56,
    paddingBottom:     20,
    paddingHorizontal: 20,
    backgroundColor:   Colors.white,
  },
  btnRegresar: {
    width:           38,
    height:          38,
    borderRadius:    19,
    backgroundColor: 'rgba(0,188,212,0.1)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  titulo: {
    fontSize:   22,
    fontWeight: '800',
    color:      Colors.bg,
  },

  // Grid
  grid: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            16,
    padding:        20,
    paddingTop:     4,
    justifyContent: 'space-between',
  },
  catCard: {
    width:        '47%',
    aspectRatio:  1,
    borderRadius: 20,
    overflow:     'hidden',
    ...Shadows.button,
  },
  gradiente: {
    flex:           1,
    width:          '100%',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            12,
    padding:        16,
    borderRadius:   20,
  },
  iconoWrap: {
    width:          80,
    height:         80,
    borderRadius:   40,
    borderWidth:    2,
    borderColor:    'rgba(255,255,255,0.4)',
    alignItems:     'center',
    justifyContent: 'center',
  },
  catNombre: {
    fontSize:   14,
    fontWeight: '800',
    color:      Colors.white,
    textAlign:  'center',
  },

  // Lista espacios
  lista: {
    padding:    20,
    paddingTop: 4,
    gap:        12,
  },
  espacioCard: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.card,
    padding:         14,
    flexDirection:   'row',
    alignItems:      'center',
    gap:             12,
    ...Shadows.card,
  },
  espacioIcono: {
    width:           52,
    height:          52,
    borderRadius:    14,
    backgroundColor: 'rgba(0,188,212,0.1)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  espacioInfo:   { flex: 1 },
  espacioNombre: { fontSize: 14, fontWeight: '800', color: Colors.bg },
  espacioDesc:   { fontSize: 12, color: Colors.textSub, marginTop: 2 },
  espacioCap:    { fontSize: 11, color: Colors.textMuted, marginTop: 3 },
  estadoRow:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  estadoDot:     { width: 8, height: 8, borderRadius: 4 },
  dotVerde:      { backgroundColor: Colors.success },
  dotNaranja:    { backgroundColor: Colors.warning },
  dotRojo:       { backgroundColor: Colors.danger  },
  estadoTexto:   { fontSize: 11, fontWeight: '700' },

  btnReservar: {
    backgroundColor: Colors.cyan,
    borderRadius:    10,
    paddingVertical:   8,
    paddingHorizontal: 14,
    ...Shadows.button,
  },
  btnReservarTexto: { fontSize: 12, fontWeight: '800', color: Colors.white },

  // Botón flotante
  btnFlotante: {
    position:        'absolute',
    bottom:          24,
    right:           24,
    width:           56,
    height:          56,
    borderRadius:    28,
    backgroundColor: Colors.cyan,
    alignItems:      'center',
    justifyContent:  'center',
    ...Shadows.button,
  },

  // Empty
  empty:     { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyTexto:{ fontSize: 16, fontWeight: '700', color: Colors.textMuted },

  // Modal
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent:  'flex-end',
  },
  modalSheet: {
    backgroundColor:      Colors.white,
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    padding:              20,
    paddingBottom:        40,
    maxHeight:            '92%',
  },
  modalHandle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: '#E0E0E0',
    alignSelf:       'center',
    marginBottom:    16,
  },
  btnCerrar: {
    position:        'absolute',
    top:             16,
    right:           16,
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: '#F5F5F5',
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          10,
  },
  modalTitulo: {
    fontSize:     20,
    fontWeight:   '800',
    color:        Colors.bg,
    marginBottom:  4,
    marginRight:   40,
  },
  modalSub: {
    fontSize:     13,
    color:        Colors.textSub,
    marginBottom: 20,
  },

  // Input label
  inputLabel: {
    fontSize:     12,
    fontWeight:   '700',
    color:        Colors.textMuted,
    marginBottom:  6,
    marginTop:    12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Selector box
  selectorBox: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#F5F5F5',
    borderRadius:    14,
    padding:         14,
    borderWidth:     1.5,
    borderColor:     'transparent',
  },
  selectorBoxActivo: {
    borderColor:     Colors.cyan,
    backgroundColor: 'rgba(0,188,212,0.05)',
  },
  selectorValor: {
    flex:       1,
    fontSize:   14,
    fontWeight: '700',
    color:      Colors.bg,
  },
  selectorSub: {
    fontSize:  11,
    color:     Colors.textMuted,
    marginTop:  2,
  },

  // Dropdown
  dropdownBox: {
    backgroundColor: Colors.white,
    borderRadius:    14,
    marginTop:       4,
    marginBottom:    4,
    borderWidth:     1,
    borderColor:     '#E0E0E0',
    overflow:        'hidden',
    ...Shadows.card,
  },
  dropdownItem: {
    flexDirection:     'row',
    alignItems:        'center',
    padding:           12,
    gap:               10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownItemActivo: {
    backgroundColor: 'rgba(0,188,212,0.06)',
  },
  dropdownItemIcon: {
    width:           32,
    height:          32,
    borderRadius:    8,
    backgroundColor: 'rgba(0,188,212,0.1)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  dropdownItemNombre: {
    flex:       1,
    fontSize:   13,
    fontWeight: '700',
    color:      Colors.bg,
  },
  dropdownItemDesc: {
    fontSize:  11,
    color:     Colors.textSub,
    marginTop:  2,
  },

  // Selectores row
  selectoresRow: {
    flexDirection: 'row',
    gap:           12,
    marginTop:     4,
  },

  // Calendario
  calendario: {
    backgroundColor: '#F9F9F9',
    borderRadius:    16,
    padding:         12,
  },
  calHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   12,
  },
  calBtn: {
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: 'rgba(0,188,212,0.1)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  calMes: { fontSize: 16, fontWeight: '800', color: Colors.bg },
  calDiasRow: {
    flexDirection:  'row',
    justifyContent: 'space-around',
    marginBottom:   8,
  },
  calDiaLabel: {
    width:      32,
    textAlign:  'center',
    fontSize:   12,
    fontWeight: '700',
    color:      Colors.textMuted,
  },
  calNumerosGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDia: {
    width:          '14.28%',
    aspectRatio:    1,
    alignItems:     'center',
    justifyContent: 'center',
    borderRadius:   20,
  },
  calDiaActivo:      { backgroundColor: Colors.cyan },
  calDiaTexto:       { fontSize: 13, color: Colors.bg, fontWeight: '500' },
  calDiaActivoTexto: { color: Colors.white, fontWeight: '800' },

  // Resumen card
  resumenCard: {
    backgroundColor: '#F9F9F9',
    borderRadius:    16,
    padding:         16,
    marginTop:       16,
    marginBottom:    8,
  },
  resumenTitulo: {
    fontSize:     16,
    fontWeight:   '800',
    color:        Colors.bg,
    marginBottom: 12,
  },
  resumenFila: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingVertical:   6,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  resumenKey: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  resumenVal: { fontSize: 13, color: Colors.bg, fontWeight: '700', textAlign: 'right', flex: 1, marginLeft: 8 },

  // Botón confirmar
  btnConfirmar: {
    backgroundColor: Colors.cyan,
    borderRadius:    14,
    padding:         16,
    alignItems:      'center',
    marginTop:       8,
    marginBottom:    8,
    ...Shadows.button,
  },
  btnConfirmarDisabled: {
    backgroundColor: Colors.textMuted,
  },
  btnConfirmarTexto: {
    fontSize:   15,
    fontWeight: '800',
    color:      Colors.white,
  },

  // Éxito
  exitoWrap: {
    alignItems:     'center',
    paddingVertical: 20,
    gap:             12,
  },
  exitoTitulo: {
    fontSize:   24,
    fontWeight: '800',
    color:      Colors.cyan,
  },
  exitoSub: {
    fontSize:  14,
    color:     Colors.textSub,
    textAlign: 'center',
  },
});