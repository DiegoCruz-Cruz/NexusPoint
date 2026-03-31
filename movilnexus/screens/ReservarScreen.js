import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadows } from '../constants/theme';

import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';


// ── MVC ─────────────────────────────────────────────
import { useUsuario } from '../context/UsuarioContext';
import { espaciosController } from '../controllers/espaciosController';
import { reservacionesController } from '../controllers/reservacionesController';

const categorias = [
  { id_tipo_espacio: 7, nombre: 'Servicio\nPsicológico', icon: 'body-outline' },
  { id_tipo_espacio: 8, nombre: 'Tutoria', icon: 'school-outline' },
  { id_tipo_espacio: 2, nombre: 'Aulas', icon: 'easel-outline' },
  { id_tipo_espacio: 1, nombre: 'Laboratorios', icon: 'flask-outline' },
  { id_tipo_espacio: 3, nombre: 'Canchas', icon: 'football-outline' },
  { id_tipo_espacio: 4, nombre: 'Centro de\ncómputo', icon: 'desktop-outline' },
];

const horarios = [
  '7:00 - 8:40', '8:40 - 10:20', '10:20 - 12:00',
  '12:00 - 13:40', '14:00 - 15:40', '15:40 - 17:20',
];

export default function ReservarScreen({ onReservaCreada }) {
  const { usuario } = useUsuario();

  // Estados de navegación interna
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados de datos
  const [loading, setLoading] = useState(false);
  const [espaciosFiltrados, setEspaciosFiltrados] = useState([]);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [reservaCreada, setReservaCreada] = useState(null);

  // Estados del Formulario (dentro del modal)
  const [espacioSel, setEspacioSel] = useState(null);
  const [horaSel, setHoraSel] = useState(horarios[0]);
  const [motivo, setMotivo] = useState('');

  // Cargar espacios al seleccionar categoría o abrir modal
  useEffect(() => {
    if (categoriaActiva) {
      cargarEspacios(categoriaActiva.id_tipo_espacio);
    }
  }, [categoriaActiva]);

  const [mesActual, setMesActual] = useState(new Date()); // Fecha para controlar el mes que se ve
  const [fechaSel, setFechaSel] = useState(new Date());   // Fecha seleccionada por el usuario

  // Función para generar los días del mes actual de forma dinámica
  const generarDiasDelMes = () => {
    const inicio = startOfMonth(mesActual);
    const fin = endOfMonth(mesActual);
    return eachDayOfInterval({ start: inicio, end: fin });
  };

  const cambiarMes = (direccion) => {
    if (direccion === 'next') setMesActual(addMonths(mesActual, 1));
    else setMesActual(subMonths(mesActual, 1));
  };

 const cargarEspacios = async (idTipo) => {
    
    await espaciosController.cargarPorTipo(idTipo, {
      setEspacios: setEspaciosFiltrados, // Cambiado de setLista a setEspacios según el controlador
      setLoading: setLoading,
      setError: setErrorGeneral
    });
  };
  const abrirModal = (espacio = null) => {
    setEspacioSel(espacio);
    setReservaCreada(null);
    setErrorGeneral('');
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setReservaCreada(null);
  };

  
const manejarConfirmar = async () => {
  if (!espacioSel) {
    setErrorGeneral('Selecciona un espacio');
    return;
  }

  // Separar el rango "7:00 - 8:40"
  const [inicio, fin] = horaSel.split(' - ');
  
  // Función interna para asegurar el formato 00:00:00
  const completarHora = (textoHora) => {
    const [h, m] = textoHora.split(':');
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
  };

  const datosParaEnviar = {
    fecha: format(fechaSel, 'yyyy-MM-dd'),
    horaInicio: completarHora(inicio),
    horaFin: completarHora(fin),
    capacidad: espacioSel.capacidad,
    idEspacio: espacioSel.id_espacio,
    motivo: motivo
  };

  await reservacionesController.crear(usuario.id_usuario, datosParaEnviar, {
    setLoading,
    setError: setErrorGeneral,
    onSuccess: (nueva) => setReservaCreada(nueva)
  });
};
        
    
  // ── RENDER MODAL ──────────────────────────────────
  const renderModal = () => (
    <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={cerrarModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <TouchableOpacity style={styles.btnCerrarModal} onPress={cerrarModal}>
            <Ionicons name="close" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {reservaCreada ? (
            <View style={styles.exitoWrap}>
              <Ionicons name="checkmark-circle" size={80} color={Colors.cyan} />
              <Text style={styles.exitoTitulo}>¡Éxito!</Text>
              <View style={styles.resumenCard}>
                <Text style={styles.resumenKey}>Folio: <Text style={styles.resumenVal}>{reservaCreada.folio_reservacion}</Text></Text>
                <Text style={styles.resumenKey}>Espacio: <Text style={styles.resumenVal}>{espacioSel?.nombre_espacio}</Text></Text>
              </View>
              <TouchableOpacity style={styles.btnConfirmar} onPress={cerrarModal}>
                <Text style={styles.btnConfirmarTexto}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitulo}>Confirmar Reserva</Text>
              <View style={styles.calHeader}>
    <TouchableOpacity onPress={() => cambiarMes('prev')}>
      <Ionicons name="chevron-back" size={24} color={Colors.cyan} />
    </TouchableOpacity>
    
    <Text style={styles.mesTexto}>
      {format(mesActual, 'MMMM yyyy', { locale: es }).toUpperCase()}
    </Text>

    <TouchableOpacity onPress={() => cambiarMes('next')}>
      <Ionicons name="chevron-forward" size={24} color={Colors.cyan} />
    </TouchableOpacity>
  </View>

  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calScroll}>
    {generarDiasDelMes().map((fecha, index) => {
      const esHoy = isSameDay(fecha, fechaSel);
      return (
        <TouchableOpacity 
          key={index} 
          style={[styles.calDia, esHoy && styles.calDiaActivo]}
          onPress={() => setFechaSel(fecha)}
        >
          <Text style={[styles.calDiaNombre, esHoy && {color: '#fff'}]}>
            {format(fecha, 'eee', { locale: es })}
          </Text>
          <Text style={[styles.calDiaTexto, esHoy && styles.calDiaActivoTexto]}>
            {format(fecha, 'd')}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
              
              <Text style={styles.inputLabel}>1. Espacio</Text>
              <View style={styles.espaciosGrid}>
                {espaciosFiltrados.map(esp => (
                  <TouchableOpacity 
                    key={esp.id_espacio} 
                    style={[styles.espacioItem, espacioSel?.id_espacio === esp.id_espacio && styles.activeEspacio]}
                    onPress={() => setEspacioSel(esp)}
                  >
                    <Text style={[styles.espacioItemTexto, espacioSel?.id_espacio === esp.id_espacio && {color: '#fff'}]}>
                      {esp.nombre_espacio}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>2. Horario</Text>
              <View style={styles.gridHorarios}>
                {horarios.map(h => (
                  <TouchableOpacity 
                    key={h} 
                    style={[styles.horaItem, horaSel === h && styles.activeHora]}
                    onPress={() => setHoraSel(h)}
                  >
                    <Text style={[styles.horaText, horaSel === h && {color: '#fff'}]}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>3. Motivo</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ej. Estudio grupal" 
                value={motivo} 
                onChangeText={setMotivo} 
              />

              {errorGeneral ? <Text style={styles.errorText}>{errorGeneral}</Text> : null}

              <TouchableOpacity style={styles.btnConfirmar} onPress={manejarConfirmar} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnConfirmarTexto}>Solicitar Reserva</Text>}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  // ── VISTA DE LISTA POR CATEGORÍA ──────────────────
  if (categoriaActiva) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.btnRegresar} onPress={() => setCategoriaActiva(null)}>
            <Ionicons name="arrow-back" size={22} color={Colors.bg} />
          </TouchableOpacity>
          <Text style={styles.titulo}>{categoriaActiva.nombre.replace('\n', ' ')}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.lista}>
          {loading ? <ActivityIndicator size="large" color={Colors.cyan} /> : 
            espaciosFiltrados.map(espacio => (
              <TouchableOpacity key={espacio.id_espacio} style={styles.espacioCard} onPress={() => abrirModal(espacio)}>
                <View style={styles.espacioIcono}>
                  <Ionicons name={categoriaActiva.icon} size={24} color={Colors.cyan} />
                </View>
                <View style={styles.espacioInfo}>
                  <Text style={styles.espacioNombre}>{espacio.nombre_espacio}</Text>
                  <Text style={styles.espacioCap}>Capacidad: {espacio.capacidad} pers.</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            ))
          }
        </ScrollView>

        <TouchableOpacity style={styles.btnFlotante} onPress={() => abrirModal()}>
          <Ionicons name="add" size={30} color={Colors.white} />
        </TouchableOpacity>
        {renderModal()}
      </View>
    );
  }

  // ── VISTA DE GRID PRINCIPAL ───────────────────────
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={26} color={Colors.cyan} />
        <Text style={styles.titulo}>Espacios y Servicios</Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {categorias.map(cat => (
          <TouchableOpacity key={cat.id_tipo_espacio} style={styles.catCard} onPress={() => setCategoriaActiva(cat)}>
            <LinearGradient colors={['#00BCD4', '#004D8C']} style={styles.gradiente}>
              <Ionicons name={cat.icon} size={40} color="#fff" />
              <Text style={styles.catNombre}>{cat.nombre}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 15 },
  btnRegresar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', color: Colors.bg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 15, justifyContent: 'space-between' },
  catCard: { width: '47%', aspectRatio: 1, borderRadius: 20, marginBottom: 15, ...Shadows.button },
  gradiente: { flex: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 10 },
  catNombre: { color: '#fff', fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  lista: { padding: 20 },
  espacioCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, ...Shadows.card },
  espacioIcono: { width: 50, height: 50, borderRadius: 10, backgroundColor: 'rgba(0,188,212,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  espacioInfo: { flex: 1 },
  espacioNombre: { fontWeight: 'bold', fontSize: 16 },
  espacioCap: { color: Colors.textMuted, fontSize: 12 },
  btnFlotante: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.cyan, alignItems: 'center', justifyContent: 'center', ...Shadows.button },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
  modalHandle: { width: 40, height: 5, backgroundColor: '#DDD', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  inputLabel: { fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: '#666' },
  espaciosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  espacioItem: { padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 10 },
  activeEspacio: { backgroundColor: Colors.cyan, borderColor: Colors.cyan },
  espacioItemTexto: { fontSize: 12, fontWeight: '600' },
  gridHorarios: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  horaItem: { padding: 10, backgroundColor: '#F5F5F5', borderRadius: 10, width: '47%' },
  activeHora: { backgroundColor: Colors.bg },
  horaText: { textAlign: 'center', fontSize: 13, fontWeight: 'bold' },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, marginTop: 5 },
  btnConfirmar: { backgroundColor: Colors.cyan, padding: 18, borderRadius: 15, marginTop: 25, alignItems: 'center' },
  btnConfirmarTexto: { color: '#fff', fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
  exitoWrap: { alignItems: 'center', padding: 20 },
  exitoTitulo: { fontSize: 24, fontWeight: 'bold', color: Colors.cyan, marginTop: 10 },
  resumenCard: { backgroundColor: '#F9F9F9', padding: 20, borderRadius: 15, width: '100%', marginTop: 20 },
  resumenKey: { fontWeight: 'bold', color: '#666', marginBottom: 5 },
  resumenVal: { color: Colors.bg },
  btnCerrarModal: { position: 'absolute', top: 20, right: 20 },
  calHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  mesTexto: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: Colors.bg 
  },
  calDiaNombre: { 
    fontSize: 10, 
    color: '#999', 
    textTransform: 'uppercase',
    marginBottom: 4
  },
  calDia: { 
    width: 60, 
    height: 70, // Un poco más alto para que quepa el nombre del día
    backgroundColor: '#F5F5F5', 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 10 
  },
});