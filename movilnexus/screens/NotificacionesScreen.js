import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../constants/theme';
import { notificaciones } from '../data/mockData';

// ── CONFIGURACIÓN VISUAL POR TIPO ─────────────────────
const tipoConfig = {
  1: { icono: 'flask-outline',          color: '#1565C0',      bg: 'rgba(21,101,192,0.12)' },
  2: { icono: 'close-circle-outline',   color: Colors.warning, bg: 'rgba(255,152,0,0.1)'   },
  3: { icono: 'notifications-outline',  color: Colors.danger,  bg: 'rgba(244,67,54,0.1)'   },
  4: { icono: 'notifications-outline',  color: Colors.cyan,    bg: 'rgba(0,188,212,0.1)'   },
  5: { icono: 'checkmark-done-outline', color: Colors.success, bg: 'rgba(0,200,83,0.1)'    },
};

export default function NotificacionesScreen() {
  const [lista,            setLista]            = useState(notificaciones);
  const [resultadoVisible, setResultadoVisible] = useState(false);
  const [resultadoAccion,  setResultadoAccion]  = useState(null);
  const [notifActual,      setNotifActual]      = useState(null);

  const noLeidas = lista.filter(n => n.leida !== 1).length;

  const ejecutarAccion = (notif, accion) => {
    setNotifActual(notif);
    setResultadoAccion(accion);
    setLista(prev =>
      prev.map(n =>
        n.id_notificacion === notif.id_notificacion
          ? { ...n, leida: 1 }
          : n
      )
    );
    setResultadoVisible(true);
  };

  const cerrarResultado = () => {
    setResultadoVisible(false);
    setResultadoAccion(null);
    setNotifActual(null);
  };

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={26} color={Colors.cyan}/>
        <Text style={styles.titulo}>Notificaciones</Text>
        {noLeidas > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{noLeidas}</Text>
          </View>
        )}
      </View>

      {/* ── Lista ── */}
      <ScrollView
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      >
        {lista.map(notif => {
          const config = tipoConfig[notif.id_tipo_notificacion] || tipoConfig[4];
          const leida = notif.leida === 1;
          return (
            <TouchableOpacity
              key={notif.id_notificacion}
              style={[styles.notifCard, leida && styles.notifCardLeida]}
              activeOpacity={0.8}
            >
              {!leida && <View style={styles.puntito}/>}

              <View style={[styles.iconoWrap, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icono} size={24} color={config.color}/>
              </View>

              <View style={styles.notifInfo}>
                <Text style={[styles.notifTitulo, leida && styles.notifTituloLeida]}>
                  {notif.titulo_notificacion}
                </Text>
                {notif.cuerpo_notificacion ? (
                  <Text style={styles.notifCuerpo}>{notif.cuerpo_notificacion}</Text>
                ) : null}

                {/* Botones solo para aprobaciones no leídas */}
                {notif.id_tipo_notificacion === 1 && !leida && (
                  <View style={styles.accionesRow}>
                    <TouchableOpacity
                      style={styles.btnConfirmar}
                      onPress={() => ejecutarAccion(notif, 'confirmar')}
                    >
                      <Text style={styles.btnConfirmarTexto}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnCancelar}
                      onPress={() => ejecutarAccion(notif, 'cancelar')}
                    >
                      <Text style={styles.btnCancelarTexto}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Modal resultado ── */}
      <Modal
        visible={resultadoVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cerrarResultado}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <View style={[
              styles.modalIconoWrap,
              { backgroundColor: resultadoAccion === 'confirmar'
                ? 'rgba(0,200,83,0.1)'
                : 'rgba(244,67,54,0.1)'
              },
            ]}>
              <Ionicons
                name={resultadoAccion === 'confirmar'
                  ? 'checkmark-circle'
                  : 'close-circle'
                }
                size={64}
                color={resultadoAccion === 'confirmar' ? Colors.success : Colors.danger}
              />
            </View>

            <Text style={styles.modalTitulo}>
              {resultadoAccion === 'confirmar'
                ? '¡Reserva Confirmada!'
                : 'Reserva Cancelada'
              }
            </Text>
            <Text style={styles.modalSub}>
              {resultadoAccion === 'confirmar'
                ? 'La reserva ha sido aprobada exitosamente.'
                : 'La reserva ha sido rechazada.'
              }
            </Text>

            <View style={styles.modalDetalle}>
              <Text style={styles.modalDetalleTexto}>
                {notifActual?.titulo_notificacion}
              </Text>
            </View>

            <TouchableOpacity style={styles.btnPrimario} onPress={cerrarResultado}>
              <Text style={styles.btnPrimarioTexto}>Entendido</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

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
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    paddingTop:        56,
    paddingBottom:     20,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize:   22,
    fontWeight: '800',
    color:      Colors.bg,
    flex:       1,
  },
  badge: {
    backgroundColor:   Colors.danger,
    borderRadius:      12,
    minWidth:          24,
    height:            24,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 6,
  },
  badgeTexto: {
    fontSize:   12,
    fontWeight: '800',
    color:      Colors.white,
  },

  // Lista
  lista: {
    padding:    16,
    paddingTop: 4,
    gap:        10,
  },

  // Card notificación
  notifCard: {
    backgroundColor: Colors.white,
    borderRadius:    Radius.card,
    padding:         14,
    flexDirection:   'row',
    alignItems:      'flex-start',
    gap:             12,
    position:        'relative',
    ...Shadows.card,
  },
  notifCardLeida: {
    backgroundColor: '#FAFAFA',
    opacity:         0.8,
  },
  puntito: {
    position:        'absolute',
    top:             14,
    right:           14,
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: Colors.cyan,
  },
  iconoWrap: {
    width:          48,
    height:         48,
    borderRadius:   14,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  notifInfo:        { flex: 1 },
  notifTitulo: {
    fontSize:     14,
    fontWeight:   '800',
    color:        Colors.bg,
    marginBottom:  2,
  },
  notifTituloLeida: {
    fontWeight: '600',
    color:      Colors.textMuted,
  },
  notifCuerpo: {
    fontSize:  13,
    color:     Colors.textSub,
    marginTop:  2,
  },

  // Botones acción
  accionesRow: {
    flexDirection: 'row',
    gap:           8,
    marginTop:     10,
  },
  btnConfirmar: {
    backgroundColor:   Colors.cyan,
    borderRadius:      8,
    paddingVertical:   6,
    paddingHorizontal: 16,
  },
  btnConfirmarTexto: {
    fontSize:   12,
    fontWeight: '800',
    color:      Colors.white,
  },
  btnCancelar: {
    backgroundColor:   Colors.danger,
    borderRadius:      8,
    paddingVertical:   6,
    paddingHorizontal: 16,
  },
  btnCancelarTexto: {
    fontSize:   12,
    fontWeight: '800',
    color:      Colors.white,
  },

  // Modal
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems:      'center',
    justifyContent:  'center',
    padding:         24,
  },
  modalBox: {
    backgroundColor: Colors.white,
    borderRadius:    24,
    padding:         24,
    width:           '100%',
    alignItems:      'center',
    gap:             12,
    ...Shadows.card,
  },
  modalIconoWrap: {
    width:          88,
    height:         88,
    borderRadius:   44,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   4,
  },
  modalTitulo: {
    fontSize:   20,
    fontWeight: '800',
    color:      Colors.bg,
    textAlign:  'center',
  },
  modalSub: {
    fontSize:   14,
    color:      Colors.textSub,
    textAlign:  'center',
    lineHeight: 20,
  },
  modalDetalle: {
    backgroundColor: '#F5F5F5',
    borderRadius:    12,
    padding:         12,
    width:           '100%',
    alignItems:      'center',
  },
  modalDetalleTexto: {
    fontSize:   13,
    fontWeight: '700',
    color:      Colors.bg,
    textAlign:  'center',
  },
  btnPrimario: {
    backgroundColor: Colors.cyan,
    borderRadius:    12,
    padding:         14,
    alignItems:      'center',
    width:           '100%',
    ...Shadows.button,
  },
  btnPrimarioTexto: {
    fontSize:   14,
    fontWeight: '800',
    color:      Colors.white,
  },
});