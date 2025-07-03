import React from "react";
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

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashHome">
        <Stack.Screen
          name="SplashHome"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Mapa"
          component={MapScreen}
          options={{ title: "Mapa de Inundaciones", headerShown: false }}
        />
        <Stack.Screen
          name="ReportarInundacion"
          component={ReportarInundacion}
          options={{ titleheaderShown: false }}
        />
        <Stack.Screen
          name="Predicciones"
          component={PrediccionesScreen}
          options={{ title: "Predicciioes de lluvias", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
