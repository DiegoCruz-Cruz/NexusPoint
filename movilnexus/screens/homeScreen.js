import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../constants/theme';

import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen({ onNavegar }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <View style={styles.logoimg}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: 70
              , height: 70 

              }}
          />
        </View>   
        <View>
          <Text style={styles.logo}>  NexusPoint </Text>
          
        </View>
        
      </View>

      <View style={styles.header}>
        
      
        <View>
          <Text style={styles.saludo}>Hola, {currentUser.nombre} </Text>
          <Text style={styles.subtitulo}>{currentUser.correo}</Text>
        </View>
        
      </View>

      {/* Próxima Reserva */}
      <Text style={styles.seccion}>Próxima Reserva</Text>
  <LinearGradient
  colors={['#4A90E2', '#38B3B8']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.reservaCard}
>
  <Text style={styles.reservaLabel}>Reserva Activa</Text>
  <Text style={styles.reservaNombre}>{proximaReserva.folio_reservacion}</Text>
  <Text style={styles.reservaInfo}>Espacio #{proximaReserva.id_espacio}</Text>
  <View style={styles.reservaRow}>
    <View style={styles.reservaHora}>
      <Ionicons name="time-outline" size={14} color={Colors.white}/>
      <Text style={styles.reservaHoraTexto}>{proximaReserva.getHorario()}</Text>
    </View>
    <View style={styles.badge}>
      <Text style={styles.badgeTexto}>Confirmada</Text>
    </View>
  </View>
</LinearGradient>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>2</Text>
          <Text style={styles.statLabel}>Reservas Activas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>1</Text>
          <Text style={styles.statLabel}>Servicios Solicitados</Text>
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
    flexDirection:  'row',
    
    alignItems:     'center',
    padding:        20,
    paddingTop:     50,
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


  // Sección
  seccion: {
    fontSize:     12,
    fontWeight:   '800',
    color:        Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginLeft:   20,
    marginBottom: 10,
    marginTop:    16,
  },
  logoimg: {
  width:        70,
  height:       70,
  borderRadius: -10,
  overflow:     'hidden',
},

  // Reserva card
  reservaCard: {
    marginHorizontal: 20,
    borderRadius:     Radius.card,
    padding:          20,
    ...Shadows.button,
  },
  reservaLabel: {
    fontSize:     11,
    fontWeight:   '700',
    color:        'rgba(255,255,255,0.75)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom:  6,
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
    flexDirection:   'row',
    alignItems:      'center',
    gap:             6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius:    10,
    paddingVertical:  6,
    paddingHorizontal:14,
  },
  reservaHoraTexto: {
    fontSize:   13,
    fontWeight: '800',
    color:      Colors.white,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius:     20,
    paddingVertical:   4,
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
    fontSize:  11,
    color:     Colors.textSub,
    marginTop:  4,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Acceso rápido
  accesoGrid: {
    flexDirection:    'row',
    flexWrap:         'wrap',
    gap:              12,
    marginHorizontal: 20,
  },
  accesoItem: {
    width:          '47%',
    backgroundColor: Colors.bgCard,
    borderRadius:   Radius.card,
    padding:        16,
    alignItems:     'center',
    gap:            8,
    ...Shadows.card,
  },
  accesoIcono: {
    width:           52,
    height:          52,
    borderRadius:    16,
    backgroundColor: 'rgba(0,188,212,0.15)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  accesoLabel: {
    fontSize:   13,
    fontWeight: '700',
    color:      Colors.white,
  },
});