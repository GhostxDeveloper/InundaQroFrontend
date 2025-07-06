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
import CONFIG from "../../config";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return re.test(password);
};

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");
    if (!validateEmail(email)) {
      setError("Ingresa un email válido.");
      return;
    }
    setLoading(true);
    const generatedCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    try {
      const response = await fetch(CONFIG.API_BASE_URL / "send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, code: generatedCode }),
      });
      if (!response.ok) {
        setError("No se pudo enviar el correo. Intenta de nuevo.");
      } else {
        setSentCode(generatedCode);
        setMessage("Código enviado. Revisa tu correo.");
        setStep(2);
      }
    } catch (e) {
      setError("Error de red. Intenta de nuevo.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");
    if (code !== sentCode) {
      setError("El código es incorrecto.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial."
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(CONFIG.API_BASE_URL / "reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("¡Contraseña cambiada exitosamente!");
        setStep(3);
      } else {
        setError(data.error || "No se pudo cambiar la contraseña.");
      }
    } catch (e) {
      setError("Error de red. Intenta de nuevo.");
    }
    setLoading(false);
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
        <Text style={styles.subtitle}>¿Olvidaste tu contraseña?</Text>
        {step === 1 && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {error ? (
              <Text
                style={{ color: "red", textAlign: "center", marginBottom: 12 }}
              >
                {error}
              </Text>
            ) : null}
            {message ? (
              <Text
                style={{
                  color: "#007AFF",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                {message}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {loading ? "Enviando..." : "Enviar instrucciones"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {step === 2 && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Código recibido</Text>
              <TextInput
                style={styles.input}
                placeholder="Código de verificación"
                placeholderTextColor="#aaa"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                placeholderTextColor="#aaa"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
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
            {error ? (
              <Text
                style={{ color: "red", textAlign: "center", marginBottom: 12 }}
              >
                {error}
              </Text>
            ) : null}
            {message ? (
              <Text
                style={{
                  color: "#007AFF",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                {message}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {loading ? "Cambiando..." : "Cambiar contraseña"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {step === 3 && (
          <>
            <Text
              style={{
                color: "#007AFF",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {message}
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Volver al login</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.forgotText}>Volver al login</Text>
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
  forgotButton: {
    alignSelf: "center",
    marginTop: 18,
  },
  forgotText: {
    color: "#007AFF",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  eyeButton: {
    paddingHorizontal: 10,
    position: "absolute",
    right: 8,
    top: 9,
    zIndex: 1,
  },
});
