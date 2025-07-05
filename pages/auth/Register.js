import React, { useState } from "react";
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
} from "react-native";
import * as Notifications from "expo-notifications";
import { registerUser } from "../../services/usersService";
import CONFIG from "../../config";

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

  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");

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
        return;
      }
      setStep(2);
    } catch (e) {
      setError("No se pudo enviar el código de verificación: " + e.message);
    }
  };

  // Verifica el código y registra
  const handleVerifyAndRegister = async () => {
    setError("");
    if (verificationCode !== sentCode) {
      setError("El código ingresado es incorrecto.");
      return;
    }
    setLoading(true);
    // Ahora enviamos también el teléfono
    const result = await registerUser({ nombre, email, telefono, password });
    setLoading(false);

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
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        enableOnAndroid={true}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.subtitle}>Crear cuenta</Text>
          {error ? (
            <Text
              style={{ color: "red", textAlign: "center", marginBottom: 10 }}
            >
              {error}
            </Text>
          ) : null}

          {step === 1 ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre completo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre completo"
                  placeholderTextColor="#aaa"
                  value={nombre}
                  onChangeText={setNombre}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu Email"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu número de teléfono"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={telefono}
                  onChangeText={setTelefono}
                  maxLength={15}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Ingresa tu Contraseña"
                    placeholderTextColor="#aaa"
                    secureTextEntry={secure}
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    onPress={() => setSecure(!secure)}
                    style={styles.eyeButton}
                  >
                    <Text style={{ color: "#aaa", fontSize: 18 }}>
                      {secure ? "🙈" : "🐵"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Contraseña</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Confirma tu Contraseña"
                    placeholderTextColor="#aaa"
                    secureTextEntry={confirmSecure}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    returnKeyType="done"
                    blurOnSubmit={true}
                  />
                  <TouchableOpacity
                    onPress={() => setConfirmSecure(!confirmSecure)}
                    style={styles.eyeButton}
                  >
                    <Text style={{ color: "#aaa", fontSize: 18 }}>
                      {confirmSecure ? "🙈" : "🐵"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.registerText}>
                ¿Ya tienes cuenta?{" "}
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.registerLink}>Inicia sesión</Text>
                </TouchableOpacity>
              </Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={sendVerificationCode}
                disabled={loading}
              >
                <Text style={styles.loginText}>
                  {loading
                    ? "Enviando código..."
                    : "Enviar código de verificación"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={{ marginBottom: 10 }}>
                Ingresa el código enviado a tu correo
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Código de verificación"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={6}
                textAlign="center"
              />
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleVerifyAndRegister}
                disabled={loading}
              >
                <Text style={styles.loginText}>
                  {loading ? "Registrando..." : "Verificar y registrar"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Más espacio al final para el teclado
    minHeight: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
  },
  innerContainer: {
    marginTop: -30,
    padding: 26,
    paddingBottom: 50, // Más espacio al final
  },
  subtitle: {
    fontSize: 22,
    color: "black",
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: "#444",
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#222",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    paddingHorizontal: 10,
    position: "absolute",
    right: 8,
    top: 9,
    zIndex: 1,
  },
  registerText: {
    textAlign: "center",
    color: "#888",
    fontSize: 15,
    marginBottom: 15,
    marginTop: 8,
  },
  registerLink: {
    color: "#111",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  loginText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "500",
  },
});
