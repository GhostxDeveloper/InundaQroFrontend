// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./routes/routes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}
