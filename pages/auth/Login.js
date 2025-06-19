import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../services/usersService"; // Asegúrate de que esta ruta sea correcta

export default function LoginScreen({ navigation }) {
  const [secure, setSecure] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(error);
    setError(null);
    const result = await loginUser({ email, password });
    setLoading(false);

    if (result.success) {
      // Aquí puedes manejar el éxito del login, por ejemplo, redirigir al usuario a la pantalla principal
      navigation.navigate("Home"); // Asegúrate de que "Home" sea el nombre correcto de tu pantalla principal
    } else {
      console.log("Error en login:", result); // Para depuración
      setError(result.error || "Error al iniciar sesión.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo en el centro superior */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo.png")} // Cambia la ruta al logo real de tu proyecto
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

        <Text style={styles.registerText}>
          ¿No tienes cuenta?{" "}
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            {loading ? "Cargando..." : "Login"}
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
