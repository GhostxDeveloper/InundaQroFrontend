import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { styles } from '../styles/Homestyles';
import axios from 'axios';

const HomeScreen = ({ navigation }) => { // Agregamos navigation como prop
  const [refreshing, setRefreshing] = useState(false);
  const [currentAlert, setCurrentAlert] = useState('Verde');
  const [weatherData, setWeatherData] = useState({
    temperature: '--°C',
    humidity: '--%',
    precipitation: '--mm',
    windSpeed: '-- km/h',
    description: 'Cargando...',
    feelsLike: '--°C',
    pressure: '-- hPa',
    visibility: '-- km'
  });
  const [loading, setLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const { logout } = useContext(AuthContext);
  // Configuración de la API
  const API_KEY = '86862d78e45e5b2b965bb7c7a40ed52a';
  const LAT = 20.5888;
  const LON = -100.38806;
  const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=es`;

  // Función para obtener datos del clima
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setWeatherError(null);

      console.log('🌤️ Llamando a la API:', WEATHER_URL);

      const response = await axios.get(WEATHER_URL, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Respuesta de la API:', response.data);
      const data = response.data;

      setWeatherData({
        temperature: `${Math.round(data.main.temp)}°C`,
        humidity: `${data.main.humidity}%`,
        precipitation: data.rain ? `${data.rain['1h'] || 0}mm` : '0mm',
        windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`,
        description: data.weather[0].description,
        feelsLike: `${Math.round(data.main.feels_like)}°C`,
        pressure: `${data.main.pressure} hPa`,
        visibility: `${(data.visibility / 1000).toFixed(1)} km`
      });

      determineAlertLevel(data);

    } catch (error) {
      console.error('❌ Error fetching weather data:', error);

      let errorMessage = 'Error al obtener datos climáticos';

      if (error.response?.status === 401) {
        errorMessage = 'API Key inválida o expirada';
      } else if (error.response?.status === 404) {
        errorMessage = 'Ubicación no encontrada';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Timeout - Revisa tu conexión';
      } else if (!error.response) {
        errorMessage = 'Sin conexión a internet';
      }

      setWeatherError(errorMessage);

      setWeatherData({
        temperature: 'N/A',
        humidity: 'N/A',
        precipitation: 'N/A',
        windSpeed: 'N/A',
        description: 'Datos no disponibles',
        feelsLike: 'N/A',
        pressure: 'N/A',
        visibility: 'N/A'
      });
    } finally {
      setLoading(false);
    }
  };

  const determineAlertLevel = (weatherData) => {
    const rainAmount = weatherData.rain ? weatherData.rain['1h'] || 0 : 0;
    const windSpeed = weatherData.wind.speed * 3.6;
    const weatherMain = weatherData.weather[0].main.toLowerCase();

    if (rainAmount > 10 || windSpeed > 50 || weatherMain.includes('thunderstorm')) {
      setCurrentAlert('Rojo');
    } else if (rainAmount > 5 || windSpeed > 30 || weatherMain.includes('rain')) {
      setCurrentAlert('Amarillo');
    } else {
      setCurrentAlert('Verde');
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeatherData();
    setRefreshing(false);
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'Verde': return '#10b981';
      case 'Amarillo': return '#f59e0b';
      case 'Rojo': return '#ef4444';
      default: return '#10b981';
    }
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case 'Verde': return '✅';
      case 'Amarillo': return '⚠️';
      case 'Rojo': return '🚨';
      default: return '✅';
    }
  };

  // Función para manejar las acciones rápidas
  const handleQuickAction = (actionId, actionTitle) => {
    switch (actionId) {
      case 1: // Reportar Inundación
        navigation.navigate('ReportarInundacion');
        break;
      case 2: // Ver Mapa - AQUÍ ES DONDE NAVEGAMOS
        navigation.navigate('Mapa');
        break;
      case 3: // Historial
        Alert.alert('Historial', 'Función próximamente');
        break;
      case 4: // Emergencias
        Alert.alert('Emergencias', 'Función próximamente');
        break;
      case 5: // Predicciones
        navigation.navigate('Predicciones');
        break;
      default:
        Alert.alert('Función', `${actionTitle} - Próximamente`);
    }
  };

  const quickActions = [
    { id: 1, title: 'Reportar Inundación', icon: '📱', color: '#3b82f6' },
    { id: 2, title: 'Ver Mapa', icon: '🗺️', color: '#10b981' },
    { id: 3, title: 'Historial', icon: '📊', color: '#8b5cf6' },
    { id: 4, title: 'Emergencias', icon: '🆘', color: '#ef4444' },
    { id: 5, title: 'Predicciones', icon: '🔮', color: '#f59e0b' },
  ];

  const recentAlerts = [
    { id: 1, zone: 'Centro Histórico', level: 'Amarillo', time: '2 horas', description: 'Acumulación de agua en calles principales' },
    { id: 2, zone: 'Juriquilla', level: 'Verde', time: '4 horas', description: 'Condiciones normales' },
    { id: 3, zone: 'El Pueblito', level: 'Rojo', time: '6 horas', description: 'Inundación severa reportada' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1e40af" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.location}>📍 Querétaro, QRO</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() =>
            Alert.alert(
              'Cerrar sesión',
              '¿Estás seguro que deseas cerrar sesión?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
              ]
            )
          }
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Alerta Principal */}
        <View style={[styles.alertCard, { backgroundColor: getAlertColor(currentAlert) }]}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertIcon}>{getAlertIcon(currentAlert)}</Text>
            <Text style={styles.alertTitle}>Nivel de Alerta: {currentAlert}</Text>
          </View>
          <Text style={styles.alertDescription}>
            {currentAlert === 'Verde' && 'Condiciones normales. No hay riesgo de inundación.'}
            {currentAlert === 'Amarillo' && 'Precaución. Posibles encharcamientos en algunas zonas.'}
            {currentAlert === 'Rojo' && '¡PELIGRO! Riesgo alto de inundación. Evite zonas bajas.'}
          </Text>
          <Text style={styles.alertTime}>
            {weatherData.description !== 'Cargando...' ? `Basado en condiciones actuales: ${weatherData.description}` : 'Cargando condiciones...'}
          </Text>
        </View>

        {/* Clima Actual */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <Text style={styles.sectionTitle}>Condiciones Climáticas</Text>
            {loading && <ActivityIndicator size="small" color="#3b82f6" />}
          </View>

          {weatherError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{weatherError}</Text>
              <TouchableOpacity onPress={fetchWeatherData} style={styles.retryButton}>
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.weatherGrid}>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherIcon}>🌡️</Text>
              <Text style={styles.weatherValue}>{weatherData.temperature}</Text>
              <Text style={styles.weatherLabel}>Temperatura</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherIcon}>💧</Text>
              <Text style={styles.weatherValue}>{weatherData.humidity}</Text>
              <Text style={styles.weatherLabel}>Humedad</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherIcon}>🌧️</Text>
              <Text style={styles.weatherValue}>{weatherData.precipitation}</Text>
              <Text style={styles.weatherLabel}>Precipitación</Text>
            </View>
            <View style={styles.weatherItem}>
              <Text style={styles.weatherIcon}>💨</Text>
              <Text style={styles.weatherValue}>{weatherData.windSpeed}</Text>
              <Text style={styles.weatherLabel}>Viento</Text>
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={() => handleQuickAction(action.id, action.title)}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Alertas Recientes */}
        <View style={styles.recentAlertsCard}>
          <Text style={styles.sectionTitle}>Alertas Recientes</Text>
          {recentAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={styles.alertItemHeader}>
                <View style={styles.alertItemLeft}>
                  <Text style={[styles.alertLevel, { color: getAlertColor(alert.level) }]}>
                    {getAlertIcon(alert.level)} {alert.level}
                  </Text>
                  <Text style={styles.alertZone}>{alert.zone}</Text>
                </View>
                <Text style={styles.alertItemTime}>hace {alert.time}</Text>
              </View>
              <Text style={styles.alertItemDescription}>{alert.description}</Text>
            </View>
          ))}
        </View>

        {/* Consejos de Seguridad */}
        <View style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>💡 Consejos de Seguridad</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Evita conducir por calles inundadas, solo 15 cm de agua pueden arrastrar tu vehículo
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Mantén un kit de emergencia con agua, alimentos no perecederos y linterna
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              • Si hay inundación en tu zona, dirígete a lugares altos y llama al 911
            </Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View >
  );
};

export default HomeScreen;
