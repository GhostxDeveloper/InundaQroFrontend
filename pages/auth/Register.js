import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import * as Notifications from "expo-notifications";
import { registerUser } from "../../services/usersService";
import CONFIG from "../../config";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const [secure, setSecure] = useState(true);
  const [confirmSecure, setConfirmSecure] = useState(true);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const stepTransitionAnim = useRef(new Animated.Value(1)).current;

  // Animación de loading para el código
  const loadingRotation = useRef(new Animated.Value(0)).current;
  const loadingScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Secuencia de animaciones de entrada
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(inputAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de flotación continua
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    floatAnimation.start();

    return () => {
      floatAnimation.stop();
    };
  }, []);

  // Animación de carga del código
  useEffect(() => {
    if (sendingCode) {
      // Rotación continua
      const rotateAnimation = Animated.loop(
        Animated.timing(loadingRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      
      // Pulso de escala
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(loadingScale, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(loadingScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      scaleAnimation.start();

      return () => {
        rotateAnimation.stop();
        scaleAnimation.stop();
      };
    } else {
      loadingRotation.setValue(0);
      loadingScale.setValue(1);
    }
  }, [sendingCode]);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const rotateInterpolate = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return re.test(password);
  };

  const validatePhone = (phone) => {
    const re = /^\d{8,}$/;
    return re.test(phone);
  };

  const sendVerificationCode = async () => {
    if (sendingCode) return; // Evita múltiples envíos

    setError("");
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError("Ingresa un email válido.");
      return;
    }
    if (!telefono.trim() || !validatePhone(telefono)) {
      setError(
        "Ingresa un número de teléfono válido (solo números, mínimo 8 dígitos)."
      );
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setSendingCode(true);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          code: code,
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        setError("No se pudo enviar el código de verificación: " + data);
        setSendingCode(false);
        return;
      }

      // Animación de transición entre pasos
      Animated.sequence([
        Animated.timing(stepTransitionAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(stepTransitionAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setSendingCode(false);
      setStep(2);
    } catch (e) {
      setError("No se pudo enviar el código de verificación: " + e.message);
      setSendingCode(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    setError("");
    if (verificationCode !== sentCode) {
      setError("El código ingresado es incorrecto.");
      return;
    }
    setLoading(true);
    const result = await registerUser({ nombre, email, telefono, password });
    setLoading(false);

    const telefono = telefono.startsWith("+") ? telefono : `+52${telefono}`;

    if (result.success) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Registro exitoso!",
          body: "Tu cuenta ha sido creada correctamente.",
        },
        trigger: null,
      });
      navigation.navigate("Login");
    } else {
      setError(result.error || "Error al registrar usuario.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor="#E0F2FE" barStyle="dark-content" />
      
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      {/* Elementos decorativos de fondo */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle1,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle2,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundCircle,
          styles.circle3,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />

      {/* Gotas decorativas */}
      <Animated.View
        style={[
          styles.drop,
          styles.drop1,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />
      <Animated.View
        style={[
          styles.drop,
          styles.drop2,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />

      {/* Ondas decorativas */}
      <Animated.View
        style={[
          styles.wave,
          styles.wave1,
          { transform: [{ translateY: floatTranslateY }] },
        ]}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: floatTranslateY }
              ]
            }
          ]}
        >
          <View style={styles.logoShadow}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Contenedor principal */}
        <Animated.View
          style={[
            styles.innerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.subtitle}>
            {step === 1 ? "Crear cuenta" : "Verificación"}
          </Text>

          {error ? (
            <Animated.View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          ) : null}

          <Animated.View
            style={[
              styles.inputsContainer,
              {
                opacity: stepTransitionAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {step === 1 ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingresa tu nombre completo"
                      placeholderTextColor="#94A3B8"
                      value={nombre}
                      onChangeText={setNombre}
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingresa tu Email"
                      placeholderTextColor="#94A3B8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Teléfono</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingresa tu número de teléfono"
                      placeholderTextColor="#94A3B8"
                      keyboardType="phone-pad"
                      value={telefono}
                      onChangeText={setTelefono}
                      maxLength={15}
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Contraseña</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Ingresa tu Contraseña"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={secure}
                      value={password}
                      onChangeText={setPassword}
                      returnKeyType="next"
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity
                      onPress={() => setSecure(!secure)}
                      style={styles.eyeButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.eyeIcon}>
                        {secure ? "🙈" : "🐵"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirmar Contraseña</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Confirma tu Contraseña"
                      placeholderTextColor="#94A3B8"
                      secureTextEntry={confirmSecure}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      returnKeyType="done"
                      blurOnSubmit={true}
                    />
                    <TouchableOpacity
                      onPress={() => setConfirmSecure(!confirmSecure)}
                      style={styles.eyeButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.eyeIcon}>
                        {confirmSecure ? "🙈" : "🐵"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>
                    ¿Ya tienes cuenta?{" "}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate("Login")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.registerLink}>Inicia sesión</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.verificationContainer}>
                  <Text style={styles.verificationText}>
                    Ingresa el código de 6 dígitos enviado a:
                  </Text>
                  <Text style={styles.emailText}>{email}</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Código de verificación</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.codeInput]}
                      placeholder="000000"
                      placeholderTextColor="#94A3B8"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      keyboardType="numeric"
                      returnKeyType="done"
                      maxLength={6}
                      textAlign="center"
                      fontSize={18}
                      letterSpacing={2}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={sendVerificationCode}
                  activeOpacity={0.7}
                  disabled={sendingCode}
                >
                  <Text style={styles.resendText}>
                    {sendingCode ? "Enviando..." : "Reenviar código"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          {/* Botón principal */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.loginButton, 
                (loading || sendingCode) && { opacity: 0.6 }
              ]}
              onPress={step === 1 ? sendVerificationCode : handleVerifyAndRegister}
              disabled={loading || sendingCode}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#0EA5E9', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <View style={styles.buttonContent}>
                  {sendingCode && (
                    <Animated.View
                      style={[
                        styles.loadingIcon,
                        {
                          transform: [
                            { rotate: rotateInterpolate },
                            { scale: loadingScale }
                          ]
                        }
                      ]}
                    >
                      <Text style={styles.loadingEmoji}>✉️</Text>
                    </Animated.View>
                  )}
                  <Text style={styles.loginText}>
                    {sendingCode
                      ? "Enviando código..."
                      : loading
                      ? "Registrando..."
                      : step === 1
                      ? "Enviar código de verificación"
                      : "Verificar y registrar"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundCircle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1000,
  },
  circle1: {
    width: 120,
    height: 120,
    top: "5%",
    left: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    top: "10%",
    right: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: "20%",
    left: "10%",
  },
  drop: {
    position: "absolute",
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  drop1: {
    width: 6,
    height: 12,
    top: "15%",
    left: width * 0.3,
    borderRadius: 6,
  },
  drop2: {
    width: 8,
    height: 14,
    top: "18%",
    right: width * 0.3,
    borderRadius: 7,
  },
  wave: {
    position: "absolute",
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.2)",
  },
  wave1: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logoShadow: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  innerContainer: {
    marginHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0369A1",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "rgba(3, 105, 161, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputsContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0369A1",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.3)",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    padding: 15,
    fontSize: 16,
    color: "#1E293B",
    flex: 1,
  },
  codeInput: {
    fontWeight: "600",
    letterSpacing: 2,
  },
  eyeButton: {
    padding: 15,
    paddingLeft: 5,
  },
  eyeIcon: {
    fontSize: 18,
    color: "#64748B",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  registerText: {
    fontSize: 15,
    color: "#64748B",
  },
  registerLink: {
    color: "#0EA5E9",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  verificationContainer: {
    alignItems: "center",
    marginBottom: 25,
    padding: 20,
    backgroundColor: "rgba(14, 165, 233, 0.05)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.1)",
  },
  verificationText: {
    fontSize: 16,
    color: "#0369A1",
    textAlign: "center",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0EA5E9",
    textAlign: "center",
  },
  resendButton: {
    alignSelf: "center",
    marginBottom: 15,
  },
  resendText: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    borderRadius: 15,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIcon: {
    marginRight: 10,
  },
  loadingEmoji: {
    fontSize: 18,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});