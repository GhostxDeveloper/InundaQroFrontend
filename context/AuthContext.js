// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       // datos usuario
    const [token, setToken] = useState(null);     // token JWT
    const [loading, setLoading] = useState(true); // para saber si carga la sesión

    useEffect(() => {
        const resetSession = async () => {
            try {
                // 🔁 Borra cualquier sesión previa al iniciar
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("user");
                console.log("✅ Sesión eliminada al iniciar la app");
            } catch (error) {
                console.log("Error borrando sesión:", error);
            } finally {
                setLoading(false);
            }
        };
        resetSession();
    }, []);

    const login = async (token, userData) => {
        setToken(token);
        setUser(userData);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
