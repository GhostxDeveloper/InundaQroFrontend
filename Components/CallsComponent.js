import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import axios from "axios";

const CallsComponent = ({ location, floodReports, userPhone }) => {
    // Para evitar alertas repetidas por el mismo reporte
    const alertedFloods = useRef(new Set());

    // Calcula la distancia entre dos coordenadas en metros
    const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Verifica si el usuario está cerca de una inundación severa y realiza la llamada
    const checkFloodProximity = async () => {
        if (!location || !floodReports || floodReports.length === 0) return;
        let foundNear = false;
        for (const report of floodReports) {
            if (report.severityLevel === "Severo") {
                const distance = getDistanceMeters(
                    location.latitude,
                    location.longitude,
                    report.location.latitude,
                    report.location.longitude
                );
                // Log para ver el id y distancia de cada reporte severo
                console.log(
                    `[ALERTA] Reporte ID: ${report.id} | Distancia: ${distance.toFixed(2)}m | Ya alertado: ${alertedFloods.current.has(report.id)}`
                );
                if (distance <= 500) {
                    foundNear = true;
                    if (!alertedFloods.current.has(report.id)) {
                        try {
                            await axios.post("https://apicallrest.onrender.com/api/alerta-inundacion", {
                                phoneNumber: userPhone,
                                message: "¡Alerta de inundación severa! Estás cerca de una zona peligrosa. Busca un lugar seguro."
                            });
                            alertedFloods.current.add(report.id);
                            console.log(`[ALERTA] Llamada realizada para reporte ID: ${report.id}`);
                            //Alert.alert("¡Alerta de inundación severa!", "Recibirás una llamada de advertencia.");
                        } catch (error) {
                            console.error("Error enviando alerta:", error);
                        }
                    }
                }
            }
        }
        // Si no estás cerca de ningún reporte severo, limpia el set para permitir alertas futuras
        if (!foundNear && alertedFloods.current.size > 0) {
            console.log("[ALERTA] Usuario alejado, limpiando alertas previas.");
            alertedFloods.current.clear();
        }
    };

    useEffect(() => {
        checkFloodProximity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, floodReports]);

    return null; // Este componente no renderiza nada visual
};

export default CallsComponent;