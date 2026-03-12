import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

export default function NotificacionesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Notificaciones</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.bg,
    alignItems:      'center',
    justifyContent:  'center',
  },
  texto: {
    color:      Colors.white,
    fontSize:   24,
    fontWeight: '800',
  },
});