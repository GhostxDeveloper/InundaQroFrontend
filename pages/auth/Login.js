import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../services/usersService";
import * as Notifications from "expo-notifications";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return re.test(password);
};

export default function LoginScreen({ navigation }) {
  const [secure, setSecure] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!validateEmail(email)) {
      setError("Ingresa un email válido.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial."
      );
      return;
    }
    setLoading(true);
    const result = await loginUser({ email, password });
    setLoading(false);

    if (result.success) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Inicio de sesión exitoso",
          body: `Bienvenido de nuevo, ${email}!`,
        },
        trigger: null,
      });
      navigation.navigate("Home");
    } else {
      setError(result.error || "Contraseña o usuario no encontrado.");
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Error de inicio de sesión",
          body: result.error || "Contraseña o usuario no encontrado.",
        },
        trigger: null,
      });
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
        <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
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

        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginBottom: 10 }}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text
            style={{
              color: "#007AFF",
              fontSize: 15,
              textDecorationLine: "underline",
            }}
          >
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          ¿No tienes cuenta?{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </Text>

        {error ? (
          <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
            {error}
          </Text>
        ) : null}
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? "Iniciando sesión..." : "Login"}
          </Text>
        </TouchableOpacity>
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
    marginTop: -50, // baja el formulario completo
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
