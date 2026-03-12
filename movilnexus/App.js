// App.js
import { useState } from 'react';
import HomeScreen           from './screens/HomeScreen';
import ReservarScreen       from './screens/ReservarScreen';
import NotificacionesScreen from './screens/NotificacionesScreen';
import PerfilScreen         from './screens/PerfilScreen';
import BottomNav            from './components/BottomNav';
import { View, StyleSheet } from 'react-native';

export default function App() {
  const [pantalla, setPantalla] = useState('home');

  const renderPantalla = () => {
    if (pantalla === 'home')    return <HomeScreen onNavegar={setPantalla}/>;
    if (pantalla === 'reservar') return <ReservarScreen onNavegar={setPantalla}/>;
    if (pantalla === 'notifs')  return <NotificacionesScreen/>;
    if (pantalla === 'perfil')  return <PerfilScreen onNavegar={setPantalla}/>;
  };

  return (
    <View style={styles.container}>
      {renderPantalla()}
      <BottomNav pantalla={pantalla} onNavegar={setPantalla}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B2136' },
});