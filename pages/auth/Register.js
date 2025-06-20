import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import * as Notifications from "expo-notifications";
import { registerUser } from "../../services/usersService";

export default function RegisterScreen({ navigation }) {
  const [secure, setSecure] = useState(true);
  const [confirmSecure, setConfirmSecure] = useState(true);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState(""); // <-- Nuevo estado
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Para verificación
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState("");

  // Envía el código al correo
  const sendVerificationCode = async () => {
    setError("");
    if (!nombre || !email || !telefono || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    // Genera código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);

    try {
      const response = await fetch(
        "http://192.168.100.47:3001/send-code", // <-- Pega aquí tu URL real
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            code: code,
          }),
        }
      );

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
    <View style={styles.container}>
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
          <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 200,
    height: 200,
  },
  innerContainer: {
    marginTop: -50,
    padding: 26,
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
