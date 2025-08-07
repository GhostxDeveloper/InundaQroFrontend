// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       
    const [token, setToken] = useState(null);     
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const checkExistingSession = async () => {
            try {
                // 🔍 Verificar si hay una sesión guardada
                const savedToken = await AsyncStorage.getItem("token");
                const savedUser = await AsyncStorage.getItem("user");

                if (savedToken && savedUser) {
                    // ✅ Restaurar sesión existente
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                    console.log("✅ Sesión restaurada");
                } else {
                    console.log("ℹ️ No hay sesión guardada");
                }
            } catch (error) {
                console.log("❌ Error verificando sesión:", error);
            } finally {
                // 🕐 Simular un tiempo mínimo de splash (opcional)
                setTimeout(() => {
                    setLoading(false);
                }, 2000); // 2 segundos de splash mínimo
            }
        };

        checkExistingSession();
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