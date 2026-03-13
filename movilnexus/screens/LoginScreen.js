
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadows } from '../constants/theme';

export default function LoginScreen({ onLogin, onRecuperar }) {
  const [modo,           setModo]           = useState('login'); // login | registro
  const [correo,         setCorreo]         = useState('');
  const [contrasenia,    setContrasenia]    = useState('');
  const [nombre,         setNombre]         = useState('');
  const [apellido,       setApellido]       = useState('');
  const [matricula,      setMatricula]      = useState('');
  const [verContrasenia, setVerContrasenia] = useState(false);
  const [errorCorreo,    setErrorCorreo]    = useState('');
  const [errorPass,      setErrorPass]      = useState('');
  const [errorNombre,    setErrorNombre]    = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const limpiarErrores = () => {
    setErrorCorreo('');
    setErrorPass('');
    setErrorNombre('');
  };

  const cambiarModo = (nuevoModo) => {
    limpiarErrores();
    setRegistroExitoso(false);
    setModo(nuevoModo);
  };

  const validarLogin = () => {
    let valido = true;
    if (!correo.includes('@')) {
      setErrorCorreo('Ingresa un correo válido');
      valido = false;
    } else setErrorCorreo('');

    if (contrasenia.length < 4) {
      setErrorPass('La contraseña es muy corta');
      valido = false;
    } else setErrorPass('');

    if (valido) onLogin();
  };

  const validarRegistro = () => {
    let valido = true;
    if (nombre.trim().length < 2) {
      setErrorNombre('Ingresa tu nombre completo');
      valido = false;
    } else setErrorNombre('');

    if (!correo.includes('@')) {
      setErrorCorreo('Ingresa un correo válido');
      valido = false;
    } else setErrorCorreo('');

    if (contrasenia.length < 6) {
      setErrorPass('La contraseña debe tener al menos 6 caracteres');
      valido = false;
    } else setErrorPass('');

    if (valido) setRegistroExitoso(true);
  };

  return (
    <LinearGradient
      colors={['#4A90E2', '#38B3B8', '#88d5d8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fondo}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCirculo}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logoImg}
              />
            </View>
            <Text style={styles.nombre}>
              <Text style={styles.nombreBold}>Nexus</Text>Point
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>

            {registroExitoso ? (
              // ── REGISTRO EXITOSO ──────────────────
              <View style={styles.exitoWrap}>
                <View style={styles.exitoIcono}>
                  <Ionicons name="checkmark-circle" size={72} color={Colors.cyan}/>
                </View>
                <Text style={styles.exitoTitulo}>¡Registro Exitoso!</Text>
                <Text style={styles.exitoSub}>
                  Tu cuenta ha sido creada correctamente.
                </Text>
                <TouchableOpacity
                  style={styles.btnPrimario}
                  onPress={() => onLogin()}
                >
                  <Text style={styles.btnPrimarioTexto}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>

            ) : (
              <>
                {/* Tabs login / registro */}
                <View style={styles.tabs}>
                  <TouchableOpacity
                    style={[styles.tab, modo === 'login' && styles.tabActivo]}
                    onPress={() => cambiarModo('login')}
                  >
                    <Text style={[
                      styles.tabTexto,
                      modo === 'login' && styles.tabTextoActivo,
                    ]}>
                      Iniciar Sesión
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tab, modo === 'registro' && styles.tabActivo]}
                    onPress={() => cambiarModo('registro')}
                  >
                    <Text style={[
                      styles.tabTexto,
                      modo === 'registro' && styles.tabTextoActivo,
                    ]}>
                      Registrarse
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ── FORMULARIO LOGIN ── */}
                {modo === 'login' && (
                  <View style={styles.formulario}>

                    <View style={styles.inputWrap}>
                      <TextInput
                        style={[styles.input, errorCorreo && styles.inputError]}
                        placeholder="Correo Electrónico"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={correo}
                        onChangeText={text => { setCorreo(text); setErrorCorreo(''); }}
                      />
                      {errorCorreo ? (
                        <Text style={styles.errorTexto}>{errorCorreo}</Text>
                      ) : null}
                    </View>

                    <View style={styles.inputWrap}>
                      <View style={[styles.inputRow, errorPass && styles.inputError]}>
                        <TextInput
                          style={styles.inputFlex}
                          placeholder="Contraseña"
                          placeholderTextColor={Colors.textMuted}
                          secureTextEntry={!verContrasenia}
                          value={contrasenia}
                          onChangeText={text => { setContrasenia(text); setErrorPass(''); }}
                        />
                        <TouchableOpacity
                          onPress={() => setVerContrasenia(!verContrasenia)}
                          style={styles.eyeBtn}
                        >
                          <Ionicons
                            name={verContrasenia ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.textMuted}
                          />
                        </TouchableOpacity>
                      </View>
                      {errorPass ? (
                        <Text style={styles.errorTexto}>{errorPass}</Text>
                      ) : null}
                    </View>

                    <TouchableOpacity
                      style={styles.btnLogin}
                      onPress={validarLogin}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#4A90E2', '#38B3B8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.btnLoginGradiente}
                      >
                        <Text style={styles.btnLoginTexto}>Iniciar Sesión</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnRecuperar}
                      onPress={onRecuperar}
                    >
                      <Text style={styles.btnRecuperarTexto}>
                        ¿Olvidaste tu contraseña?
                      </Text>
                    </TouchableOpacity>

                  </View>
                )}

                {/* ── FORMULARIO REGISTRO ── */}
                {modo === 'registro' && (
                  <View style={styles.formulario}>

                    {/* Nombre */}
                    <View style={styles.inputWrap}>
                      <TextInput
                        style={[styles.input, errorNombre && styles.inputError]}
                        placeholder="Nombre(s)"
                        placeholderTextColor={Colors.textMuted}
                        value={nombre}
                        onChangeText={text => { setNombre(text); setErrorNombre(''); }}
                      />
                      {errorNombre ? (
                        <Text style={styles.errorTexto}>{errorNombre}</Text>
                      ) : null}
                    </View>

                    {/* Apellido */}
                    <View style={styles.inputWrap}>
                      <TextInput
                        style={styles.input}
                        placeholder="Apellidos"
                        placeholderTextColor={Colors.textMuted}
                        value={apellido}
                        onChangeText={setApellido}
                      />
                    </View>

                    {/* Matrícula */}
                    <View style={styles.inputWrap}>
                      <TextInput
                        style={styles.input}
                        placeholder="Matrícula"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="number-pad"
                        value={matricula}
                        onChangeText={setMatricula}
                      />
                    </View>

                    {/* Correo */}
                    <View style={styles.inputWrap}>
                      <TextInput
                        style={[styles.input, errorCorreo && styles.inputError]}
                        placeholder="Correo Electrónico"
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={correo}
                        onChangeText={text => { setCorreo(text); setErrorCorreo(''); }}
                      />
                      {errorCorreo ? (
                        <Text style={styles.errorTexto}>{errorCorreo}</Text>
                      ) : null}
                    </View>

                    {/* Contraseña */}
                    <View style={styles.inputWrap}>
                      <View style={[styles.inputRow, errorPass && styles.inputError]}>
                        <TextInput
                          style={styles.inputFlex}
                          placeholder="Contraseña"
                          placeholderTextColor={Colors.textMuted}
                          secureTextEntry={!verContrasenia}
                          value={contrasenia}
                          onChangeText={text => { setContrasenia(text); setErrorPass(''); }}
                        />
                        <TouchableOpacity
                          onPress={() => setVerContrasenia(!verContrasenia)}
                          style={styles.eyeBtn}
                        >
                          <Ionicons
                            name={verContrasenia ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.textMuted}
                          />
                        </TouchableOpacity>
                      </View>
                      {errorPass ? (
                        <Text style={styles.errorTexto}>{errorPass}</Text>
                      ) : null}
                    </View>

                    <TouchableOpacity
                      style={styles.btnLogin}
                      onPress={validarRegistro}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#4A90E2', '#38B3B8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.btnLoginGradiente}
                      >
                        <Text style={styles.btnLoginTexto}>Crear Cuenta</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                  </View>
                )}

              </>
            )}

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fondo:        { flex: 1 },
  keyboardView: { flex: 1 },
  scroll: {
    flexGrow:       1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        24,
    gap:            28,
  },

  // Logo
  logoWrap: {
    alignItems: 'center',
    gap:        12,
  },
  logoCirculo: {
    width:           150,
    height:          150,
    borderRadius:    75,
    backgroundColor: 'rgba(164,226,235,0.74)',
    alignItems:      'center',
    justifyContent:  'center',
    
  },
  logoImg: {
    width:  75,
    height: 75,
  },
  nombre: {
    fontSize:   28,
    fontWeight: '400',
    color:      '#FFFFFF',
  },
  nombreBold: {
    fontWeight: '900',
    color:      '#FFFFFF',
  },

  // Card
  card: {
    width:           '100%',
    backgroundColor: Colors.white,
    borderRadius:    24,
    padding:         24,
    gap:             16,
    ...Shadows.card,
  },

  // Tabs
  tabs: {
    flexDirection:   'row',
    backgroundColor: '#F5F5F5',
    borderRadius:    14,
    padding:         4,
  },
  tab: {
    flex:           1,
    paddingVertical: 10,
    alignItems:     'center',
    borderRadius:   10,
  },
  tabActivo: {
    backgroundColor: Colors.white,
    ...Shadows.card,
  },
  tabTexto: {
    fontSize:   13,
    fontWeight: '700',
    color:      Colors.textMuted,
  },
  tabTextoActivo: {
    color: Colors.cyan,
  },

  // Formulario
  formulario: {
    gap: 12,
  },
  inputWrap: {
    gap: 4,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius:    12,
    padding:         14,
    fontSize:        14,
    color:           Colors.bg,
    borderWidth:     1.5,
    borderColor:     'transparent',
  },
  inputRow: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#F5F5F5',
    borderRadius:    12,
    borderWidth:     1.5,
    borderColor:     'transparent',
    paddingRight:    10,
  },
  inputFlex: {
    flex:     1,
    padding:  14,
    fontSize: 14,
    color:    Colors.bg,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  eyeBtn: {
    padding: 4,
  },
  errorTexto: {
    fontSize:   12,
    color:      Colors.danger,
    fontWeight: '600',
    marginLeft:  4,
  },

  // Botón login
  btnLogin: {
    borderRadius: Radius.button,
    overflow:     'hidden',
    marginTop:    4,
    ...Shadows.button,
  },
  btnLoginGradiente: {
    padding:    16,
    alignItems: 'center',
  },
  btnLoginTexto: {
    fontSize:   16,
    fontWeight: '800',
    color:      Colors.white,
  },

  // Recuperar
  btnRecuperar: {
    alignItems: 'center',
    marginTop:  4,
  },
  btnRecuperarTexto: {
    fontSize:   13,
    color:      Colors.textSub,
    fontWeight: '600',
  },

  // Botón primario
  btnPrimario: {
    backgroundColor: Colors.cyan,
    borderRadius:    Radius.button,
    padding:         16,
    alignItems:      'center',
    width:           '100%',
    ...Shadows.button,
  },
  btnPrimarioTexto: {
    fontSize:   15,
    fontWeight: '800',
    color:      Colors.white,
  },

  // Éxito
  exitoWrap: {
    alignItems:     'center',
    paddingVertical: 12,
    gap:            12,
  },
  exitoIcono: {
    marginBottom: 4,
  },
  exitoTitulo: {
    fontSize:   22,
    fontWeight: '800',
    color:      Colors.cyan,
  },
  exitoSub: {
    fontSize:  14,
    color:     Colors.textSub,
    textAlign: 'center',
    lineHeight: 20,
  },
});
