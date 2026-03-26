import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from './constants/theme';

import SplashScreen         from './screens/SplashScreen';
import LoginScreen          from './screens/LoginScreen';
import RecuperarScreen      from './screens/RecuperarScreen';
import HomeScreen           from './screens/homeScreen';
import ReservarScreen       from './screens/ReservarScreen';
import NotificacionesScreen from './screens/NotificacionesScreen';
import PerfilScreen         from './screens/PerfilScreen';
import BottomNav            from './components/BottomNav';

export default function App() {
  const [vista,    setVista]    = useState('splash');
  const [pantalla, setPantalla] = useState('home');

  // ── Splash ────────────────────────────────────────
  if (vista === 'splash') {
    return <SplashScreen onTerminar={() => setVista('login')}/>;
  }

  // ── Login ─────────────────────────────────────────
  if (vista === 'login') {
    return (
      <LoginScreen
        onLogin={()     => setVista('app')}
        onRecuperar={() => setVista('recuperar')}
      />
    );
  }

  // ── Recuperar contraseña ──────────────────────────
  if (vista === 'recuperar') {
    return <RecuperarScreen onRegresar={() => setVista('login')}/>;
  }

  // ── App principal ─────────────────────────────────
  const renderPantalla = () => {
    if (pantalla === 'home')    return <HomeScreen            onNavegar={setPantalla}/>;
    if (pantalla === 'reservar')return <ReservarScreen        onNavegar={setPantalla}/>;
    if (pantalla === 'notifs')  return <NotificacionesScreen/>;
    if (pantalla === 'perfil')  return (
      <PerfilScreen onNavegar={(destino) => {
        if (destino === 'cerrarSesion') {
          setPantalla('home');
          setVista('login');
        }
      }}/>
    );
  };

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        {renderPantalla()}
        <BottomNav pantalla={pantalla} onNavegar={setPantalla}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.white,
  },
  container: {
    flex:            1,
    backgroundColor: Colors.white,
  },
});