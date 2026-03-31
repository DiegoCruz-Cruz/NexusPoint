// ─────────────────────────────────────────────────────
// screens/homeScreen.js — Vista actualizada con MVC
// Cambios respecto al original:
//   - Quitado import de mockData (currentUser, proximaReserva)
//   - Agregado useUsuario() para sesión real
//   - Agregado useEffect que carga reservaciones desde la API
//   - El diseño visual es IDÉNTICO al original
// ─────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView,
  StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Ionicons }        from '@expo/vector-icons';
import { LinearGradient }  from 'expo-linear-gradient';
import { Colors, Radius, Shadows } from '../constants/theme';

// ── MVC ─────────────────────────────────────────────

import { reservacionesController }     from '../controllers/reservacionesController';
import { useUsuario } from '../context/UsuarioContext';

// Estados de reservación para mostrar el texto correcto
const ESTADOS = {
  1: { texto: 'Pendiente',  color: Colors.warning },
  2: { texto: 'Aprobada',   color: Colors.success },
  3: { texto: 'Rechazada',  color: Colors.danger  },
  4: { texto: 'Cancelada',  color: Colors.danger  },
  5: { texto: 'Finalizada', color: Colors.textMuted },
};

export default function HomeScreen({ onNavegar }) {
  const { usuario } = useUsuario(); // UsuarioOut real de la sesión

  // ── Estado de UI ──────────────────────────────────
  const [reservaciones, setReservaciones] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  // ── Carga reservaciones del usuario al montar ─────
  useEffect(() => {
    if (!usuario) return;
    reservacionesController.cargarPorUsuario(usuario.id_usuario, {
      setLista:   setReservaciones,
      setLoading,
      setError,
    });
  }, [usuario]);

  // Próxima reserva: la primera Aprobada (2) o Pendiente (1)
  const proximaReserva = reservaciones.find(
    r => r.id_estado_reservacion === 2 || r.id_estado_reservacion === 1
  ) ?? null;

  // Conteos para las stats
  const reservasActivas = reservaciones.filter(
    r => r.id_estado_reservacion === 1 || r.id_estado_reservacion === 2
  ).length;

  // Nombre corto del usuario para el saludo
  const nombreCorto = usuario?.nombre ?? '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header logo ── */}
      <View style={styles.header}>
        <View style={styles.logoimg}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 70, height: 70 }}
          />
        </View>
        <View>
          <Text style={styles.logo}>  NexusPoint </Text>
        </View>
      </View>

      {/* ── Header saludo ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.saludo}>Hola, {nombreCorto}</Text>
          <Text style={styles.subtitulo}>{usuario?.correo}</Text>
        </View>
      </View>

      {/* ── Próxima Reserva ── */}
      <Text style={styles.seccion}>Próxima Reserva</Text>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={Colors.cyan} />
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.danger} />
          <Text style={styles.errorTexto}>{error}</Text>
        </View>
      ) : proximaReserva ? (
        <LinearGradient
          colors={['#4A90E2', '#38B3B8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.reservaCard}
        >
          <Text style={styles.reservaLabel}>Reserva Activa</Text>
          <Text style={styles.reservaNombre}>{proximaReserva.folio_reservacion}</Text>
          <Text style={styles.reservaInfo}>
            Espacio #{proximaReserva.id_espacio}
            {proximaReserva.motivo ? `  ·  ${proximaReserva.motivo}` : ''}
          </Text>
          <View style={styles.reservaRow}>
            <View style={styles.reservaHora}>
              <Ionicons name="time-outline" size={14} color={Colors.white} />
              <Text style={styles.reservaHoraTexto}>
                {proximaReserva.hora_inicio?.slice(0, 5)} - {proximaReserva.hora_fin?.slice(0, 5)}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>
                {ESTADOS[proximaReserva.id_estado_reservacion]?.texto ?? 'Activa'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      ) : (
        // Sin reservas activas
        <TouchableOpacity
          style={styles.sinReservaCard}
          onPress={() => onNavegar('reservar')}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={32} color={Colors.cyan} />
          <Text style={styles.sinReservaTexto}>No tienes reservas activas</Text>
          <Text style={styles.sinReservaLink}>Reservar un espacio →</Text>
        </TouchableOpacity>
      )}

      {/* ── Stats ── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{reservasActivas}</Text>
          <Text style={styles.statLabel}>Reservas Activas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>
            {reservaciones.filter(r => r.id_estado_reservacion === 5).length}
          </Text>
          <Text style={styles.statLabel}>Reservas Finalizadas</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingBottom: 24,
    paddingTop:    40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       20,
    paddingTop:    50,
  },
  logo: {
    fontSize:   37,
    fontWeight: '800',
    color:      Colors.cyan,
  },
  saludo: {
    fontSize:   29,
    fontWeight: '800',
    color:      Colors.bg,
  },
  subtitulo: {
    fontSize:  13,
    color:     Colors.textSub,
    marginTop: 2,
  },
  logoimg: {
    width:        70,
    height:       70,
    borderRadius: -10,
    overflow:     'hidden',
  },

  // Sección
  seccion: {
    fontSize:      12,
    fontWeight:    '800',
    color:         Colors.textMuted,
    letterSpacing:  1,
    textTransform: 'uppercase',
    marginLeft:    20,
    marginBottom:  10,
    marginTop:     16,
  },

  // Loading y error
  loadingCard: {
    marginHorizontal: 20,
    borderRadius:     Radius.card,
    padding:          32,
    alignItems:       'center',
    backgroundColor:  '#F9F9F9',
  },
  errorCard: {
    marginHorizontal: 20,
    borderRadius:     Radius.card,
    padding:          16,
    flexDirection:    'row',
    alignItems:       'center',
    gap:              8,
    backgroundColor:  'rgba(244,67,54,0.06)',
  },
  errorTexto: {
    fontSize:   13,
    color:      Colors.danger,
    fontWeight: '600',
    flex:       1,
  },

  // Sin reservas
  sinReservaCard: {
    marginHorizontal: 20,
    borderRadius:     Radius.card,
    padding:          24,
    alignItems:       'center',
    gap:              8,
    backgroundColor:  'rgba(0,188,212,0.06)',
    borderWidth:      1.5,
    borderColor:      'rgba(0,188,212,0.2)',
    borderStyle:      'dashed',
  },
  sinReservaTexto: {
    fontSize:   14,
    fontWeight: '700',
    color:      Colors.textMuted,
  },
  sinReservaLink: {
    fontSize:   13,
    fontWeight: '700',
    color:      Colors.cyan,
  },

  // Reserva card
  reservaCard: {
    marginHorizontal: 20,
    borderRadius:     Radius.card,
    padding:          20,
    ...Shadows.button,
  },
  reservaLabel: {
    fontSize:      11,
    fontWeight:    '700',
    color:         'rgba(255,255,255,0.75)',
    letterSpacing:  1,
    textTransform: 'uppercase',
    marginBottom:   6,
  },
  reservaNombre: {
    fontSize:   20,
    fontWeight: '800',
    color:      Colors.white,
  },
  reservaInfo: {
    fontSize:  13,
    color:     'rgba(255,255,255,0.85)',
    marginTop:  4,
  },
  reservaRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginTop:      16,
  },
  reservaHora: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    backgroundColor:   'rgba(255,255,255,0.2)',
    borderRadius:      10,
    paddingVertical:    6,
    paddingHorizontal: 14,
  },
  reservaHoraTexto: {
    fontSize:   13,
    fontWeight: '800',
    color:      Colors.white,
  },
  badge: {
    backgroundColor:   'rgba(255,255,255,0.2)',
    borderRadius:      20,
    paddingVertical:    4,
    paddingHorizontal: 12,
  },
  badgeTexto: {
    fontSize:   11,
    fontWeight: '800',
    color:      Colors.white,
  },

  // Stats
  statsRow: {
    flexDirection:    'row',
    gap:              12,
    marginHorizontal: 20,
    marginTop:        16,
  },
  statCard: {
    flex:            1,
    backgroundColor: Colors.bgCard,
    borderRadius:    Radius.card,
    padding:         16,
    alignItems:      'center',
    ...Shadows.card,
  },
  statValor: {
    fontSize:   28,
    fontWeight: '800',
    color:      Colors.cyan,
  },
  statLabel: {
    fontSize:   11,
    color:      Colors.textSub,
    marginTop:   4,
    fontWeight: '600',
    textAlign:  'center',
  },
});
