import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../pages/Home";
import SplashScreen from "../pages/SplashScreen";
import MapScreen from "../pages/MapScreen";
import ReportarInundacion from "../pages/ReportarInundacion";
import PrediccionesScreen from "../pages/PrediccionesScreen";

import LoginScreen from "../pages/auth/Login";
import WelcomeScreen from "../pages/auth/Welcome";
import RegisterScreen from "../pages/auth/Register";
import ForgotPasswordScreen from "../pages/auth/ForgotPassword";

import { AuthContext } from "../context/AuthContext";

const Stack = createStackNavigator();

export default function Routes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Mientras carga el estado de sesión, mostramos splash
    return <SplashScreen />;
  }

  return (

    <Stack.Navigator>
      {user ? (
        // Rutas privadas: usuario autenticado
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Mapa"
            component={MapScreen}
            options={{ headerShown: false, title: "Mapa de Inundaciones" }}
          />
          <Stack.Screen
            name="ReportarInundacion"
            component={ReportarInundacion}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Predicciones"
            component={PrediccionesScreen}
            options={{ headerShown: false, title: "Predicciones de lluvias" }}
          />
        </>
      ) : (
        // Rutas públicas: login, registro, bienvenida, etc.
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>

  );
}
