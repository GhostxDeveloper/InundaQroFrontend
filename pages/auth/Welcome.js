import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.innerCard}>
        {/* Reemplaza con tu propia imagen o SVG */}
        <Image
          source={require("../../assets/logo.png")} // Cambia esto por la ruta de tu imagen
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bienvenido a{"\n"}InundaQRO</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ababab", // Color gris del fondo
    justifyContent: "center",
    alignItems: "center",
  },
  innerCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 24,
    width: "90%",
    alignItems: "center",
    elevation: 4, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 220,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "500",
  },
  registerButton: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  registerText: {
    color: "#222",
    fontSize: 17,
    fontWeight: "500",
  },
});
