import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Colors, Radius, Shadows } from '../constants/theme';


export default function PerfilScreen({ onNavegar }) {
  const [modalVisible, setModalVisible] = useState(false);

  const carrera = carreras.find(c => c.id_carrera === currentUser.id_carrera);
  const rol     = roles.find(r => r.id_rol === currentUser.id_rol);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text style={styles.titulo}>Perfil</Text>

        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={styles.avatarCirculo}>
            <Text style={styles.avatarTexto}>
              {currentUser.getInitiales()}
            </Text>
          </View>
          <Text style={styles.nombre}>{currentUser.getNombreCompleto()}</Text>
          <View style={styles.rolBadge}>
            <Text style={styles.rolTexto}>{rol?.nombre_rol}</Text>
          </View>
        </View>

        {/* Datos personales */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>DATOS PERSONALES</Text>
          <View style={styles.fila}>
            <Text style={styles.filaKey}>Correo</Text>
            <Text style={styles.filaVal}>{currentUser.correo}</Text>
          </View>
          <View style={styles.separador}/>
          <View style={styles.fila}>
            <Text style={styles.filaKey}>Matrícula</Text>
            <Text style={styles.filaVal}>{currentUser.matricula}</Text>
          </View>
        </View>

        {/* Información académica */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>INFORMACIÓN ACADÉMICA</Text>
          <View style={styles.fila}>
            <Text style={styles.filaKey}>Carrera</Text>
            <Text style={styles.filaVal}>{carrera?.nombre_carrera}</Text>
          </View>
          <View style={styles.separador}/>
          <View style={styles.fila}>
            <Text style={styles.filaKey}>Cuatrimestre</Text>
            <Text style={styles.filaVal}>{currentUser.cuatrimestre}to</Text>
          </View>
          <View style={styles.separador}/>
          <View style={styles.fila}>
            <Text style={styles.filaKey}>Clave</Text>
            <Text style={styles.filaVal}>{carrera?.clave_carrera}</Text>
          </View>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity
          style={styles.btnCerrar}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnCerrarTexto}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal confirmación */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            {/* Icono */}
            <View style={styles.modalIconoWrap}>
              <Ionicons name="log-out-outline" size={48} color={Colors.danger}/>
            </View>

            {/* Texto */}
            <Text style={styles.modalTitulo}>¿Cerrar Sesión?</Text>
            <Text style={styles.modalSub}>
              Tu sesión será cerrada y tendrás que volver a iniciar sesión.
            </Text>

            {/* Botones */}
            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={styles.btnSecundario}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimario}
                onPress={() => {
                  setModalVisible(false);
                  onNavegar('cerrarSesion');
                }}
              >
                <Text style={styles.btnPrimarioTexto}>Sí, cerrar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex:            1,
    backgroundColor: Colors.white,
  },
  container: {
    flex:            1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingBottom: 40,
  },

  // Título
  titulo: {
    fontSize:          24,
    fontWeight:        '800',
    color:             Colors.bg,
    paddingHorizontal: 20,
    paddingTop:        56,
    marginBottom:      24,
  },

  // Avatar
  avatarWrap: {
    alignItems:   'center',
    marginBottom: 24,
    gap:          8,
  },
  avatarCirculo: {
    width:           100,
    height:          100,
    borderRadius:    50,
    backgroundColor: Colors.cyan,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    4,
    ...Shadows.button,
  },
  avatarTexto: {
    fontSize:   36,
    fontWeight: '800',
    color:      Colors.white,
  },
  nombre: {
    fontSize:   20,
    fontWeight: '800',
    color:      Colors.bg,
  },
  rolBadge: {
    backgroundColor:   'rgba(0,188,212,0.12)',
    borderRadius:      20,
    paddingVertical:    4,
    paddingHorizontal: 14,
  },
  rolTexto: {
    fontSize:   12,
    fontWeight: '700',
    color:      Colors.cyan,
  },

  // Card
  card: {
    backgroundColor:  Colors.white,
    borderRadius:     Radius.card,
    marginHorizontal: 20,
    marginBottom:     16,
    padding:          16,
    ...Shadows.card,
  },
  cardTitulo: {
    fontSize:     12,
    fontWeight:   '800',
    color:        Colors.bg,
    letterSpacing: 1,
    marginBottom: 14,
  },
  fila: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'flex-start',
    paddingVertical:  8,
    gap:             12,
  },
  filaKey: {
    fontSize:   13,
    fontWeight: '700',
    color:      Colors.textMuted,
    minWidth:   90,
  },
  filaVal: {
    fontSize:   13,
    fontWeight: '600',
    color:      Colors.bg,
    flex:       1,
    textAlign:  'right',
  },
  separador: {
    height:          1,
    backgroundColor: '#F0F0F0',
  },

  // Botón cerrar sesión
  btnCerrar: {
    marginHorizontal: 20,
    marginTop:        8,
    backgroundColor:  Colors.danger,
    borderRadius:     Radius.button,
    padding:          16,
    alignItems:       'center',
    ...Shadows.card,
  },
  btnCerrarTexto: {
    fontSize:   15,
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
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: 'rgba(244,67,54,0.1)',
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    4,
  },
  modalTitulo: {
    fontSize:   20,
    fontWeight: '800',
    color:      Colors.bg,
    textAlign:  'center',
  },
  modalSub: {
    fontSize:  14,
    color:     Colors.textSub,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBotones: {
    flexDirection: 'row',
    gap:           10,
    marginTop:     4,
    width:         '100%',
  },
  btnSecundario: {
    flex:            1,
    backgroundColor: '#F5F5F5',
    borderRadius:    12,
    padding:         14,
    alignItems:      'center',
  },
  btnSecundarioTexto: {
    fontSize:   14,
    fontWeight: '700',
    color:      Colors.textMuted,
  },
  btnPrimario: {
    flex:            1,
    backgroundColor: Colors.danger,
    borderRadius:    12,
    padding:         14,
    alignItems:      'center',
    ...Shadows.button,
  },
  btnPrimarioTexto: {
    fontSize:   14,
    fontWeight: '800',
    color:      Colors.white,
  },
});