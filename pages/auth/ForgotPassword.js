import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { sendForgotPasswordCodeApi, resetPasswordApi } from '../../services/usersService';
import CONFIG from "../../config";

const { width, height } = Dimensions.get('window');

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
    const result = await sendForgotPasswordCodeApi(email);

    if (result.success) {
      setMessage("Código enviado. Revisa tu correo.");
      setStep(2);
    } else {
      setError(result.error || "No se pudo enviar el código.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (!validatePassword(newPassword)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, un número y un carácter especial."
      );
      return;
    }

    if (!code || code.length !== 6) {
      setError("Ingresa un código válido de 6 dígitos.");
      return;
    }

    setLoading(true);
    const result = await resetPasswordApi({ email, code, newPassword });

    if (result.success) {
      setMessage("¡Contraseña cambiada exitosamente!");
      setStep(3);
    } else {
      setError(result.error || "Error al cambiar la contraseña.");
    }
    setLoading(false);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Recuperar contraseña";
      case 2:
        return "Verificar código";
      case 3:
        return "¡Listo!";
      default:
        return "Recuperar contraseña";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return "Ingresa tu email y te enviaremos un código de verificación";
      case 2:
        return "Ingresa el código que recibiste y tu nueva contraseña";
      case 3:
        return "Tu contraseña ha sido cambiada exitosamente";
      default:
        return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con indicador de progreso */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
            <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
            <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
            <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
            <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
          </View>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{getStepTitle()}</Text>
          <Text style={styles.description}>{getStepDescription()}</Text>

          {/* Paso 1: Solicitar código */}
          {step === 1 && (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              ) : null}

              {message ? (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>✅ {message}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                onPress={handleForgotPassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Enviando..." : "Enviar código"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Paso 2: Verificar código y nueva contraseña */}
          {step === 2 && (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Código de verificación</Text>
                <TextInput
                  style={[styles.input, styles.codeInput, error && styles.inputError]}
                  placeholder="000000"
                  placeholderTextColor="#9CA3AF"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="numeric"
                  maxLength={6}
                  textAlign="center"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nueva contraseña</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, error && styles.inputError]}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="#9CA3AF"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={secure}
                  />
                  <TouchableOpacity
                    onPress={() => setSecure(!secure)}
                    style={styles.eyeButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eyeIcon}>
                      {secure ? "👁️" : "🙈"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              ) : null}

              {message ? (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>✅ {message}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {loading ? "Procesando..." : "Cambiar contraseña"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Paso 3: Éxito */}
          {step === 3 && (
            <View style={styles.formContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.checkIcon}>✅</Text>
              </View>
              
              <Text style={styles.successMessage}>{message}</Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Ir al login</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Botón de regreso */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Volver atrás</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: "#3B82F6",
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  progressLineActive: {
    backgroundColor: "#3B82F6",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 80,
    height: 80,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    color: "#1F2937",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  codeInput: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 8,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIcon: {
    fontSize: 20,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  backButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
  },
  successContainer: {
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#22C55E",
  },
  successText: {
    color: "#16A34A",
    fontSize: 14,
    fontWeight: "500",
  },
  successIcon: {
    alignItems: "center",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 48,
  },
  successMessage: {
    fontSize: 18,
    color: "#16A34A",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },
});