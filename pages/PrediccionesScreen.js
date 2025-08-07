import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  FlatList,
  Switch,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { styles } from '../styles/PredictionStyles';

const { width, height } = Dimensions.get('window');

const PrediccionesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [predictionZones, setPredictionZones] = useState([]);

  // Estados para actualización automática
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 segundos
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // Nuevo estado para la predicción personalizada
  const [customPrediction, setCustomPrediction] = useState(null);

  // Estados para la búsqueda
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  const [confirmButtonPressed, setConfirmButtonPressed] = useState(false);
  const [preventBlur, setPreventBlur] = useState(false); // Nuevo estado para prevenir el blur

  const mapRef = useRef(null);
  const searchMapRef = useRef(null);

  // Función para obtener datos del servidor
  const fetchData = async () => {
    try {
      const response = await fetch('https://apicallrest-1.onrender.com/predicciones');
      if (!response.ok) throw new Error('Error al obtener predicciones');
      
      const data = await response.json();
      setPredictionZones(data.zonas || []);
      setLastUpdateTime(new Date());
    } catch (error) {
      console.error('Error actualizando datos:', error);
      // No mostramos alert durante actualización automática para no molestar al usuario
      if (!autoRefresh) {
        Alert.alert('Error', 'No se pudieron actualizar los datos');
      }
    }
  };

  const formatSearchResults = (data) => {
    return data.map(item => ({
      id: item.place_id,
      name: item.display_name.split(',')[0] || item.display_name,
      fullAddress: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.address || {},
    }));
  };

  // Región inicial de Querétaro
  const initialRegion = {
    latitude: 20.5888,
    longitude: -100.38806,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  const chartHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <script src="https://code.highcharts.com/highcharts.js"></script>

  <style>
    body { margin: 0; padding: 10px; font-family: Arial, sans-serif; background-color: transparent; }
    #container { width: 100%; height: 280px; }
  </style>
</head>
<body>
  <div id="container"></div>
  <script>
    Highcharts.chart('container', {
      chart: {
        type: 'column',
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Inundaciones en Querétaro (2020-2024)',
        style: { fontSize: '16px', fontWeight: 'bold' }
      },
      subtitle: {
        text: 'Incidentes por año'
      },
      xAxis: {
        categories: ['2020', '2021', '2022', '2023', '2024'],
        title: { text: 'Año' }
      },
      yAxis: {
        min: 0,
        title: { text: 'Número de Incidentes' }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: { enabled: true }
        }
      },
      series: [{
        name: 'Inundaciones',
        data: [9, 15, 6, 12, 8],
        color: '#2E86AB'
      }],
      credits: { enabled: false },
      legend: { enabled: false }
    });
  </script>
</body>
</html>
`;

  // Inicialización de datos
  const initializeData = async () => {
    try {
      setLoading(true);

      // Obtener ubicación actual (opcional para centrar mapa)
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
      }

      // Cargar datos iniciales
      await fetchData();
      setLoading(false);

    } catch (error) {
      console.error('Error inicializando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de predicción');
      setLoading(false);
    }
  };

  // useEffect para inicialización
  useEffect(() => {
    initializeData();
  }, []);

  // useEffect para manejo de actualización automática
  useEffect(() => {
    let intervalId;
    
    if (autoRefresh) {
      intervalId = setInterval(fetchData, refreshInterval);
      // Ejecutar inmediatamente la primera vez
      fetchData();
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval]);

  // Función para formatear la hora de última actualización
  const formatLastUpdateTime = () => {
    if (!lastUpdateTime) return '';
    return lastUpdateTime.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Función para buscar lugares usando geocodificación
  const searchPlaces = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);

    try {
      // Usar la API de geocodificación de OpenStreetMap (Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Querétaro, México&limit=5&addressdetails=1`
      );

      if (!response.ok) throw new Error('Error en la búsqueda');

      const data = await response.json();

      const formattedResults = data.map(item => ({
        id: item.place_id,
        name: item.display_name,
        fullAddress: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        address: item.address || {},
      }));

      setSearchResults(formattedResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error buscando lugares:', error);
      Alert.alert('Error', 'No se pudo realizar la búsqueda');
    } finally {
      setSearchLoading(false);
    }
  };

  // Función para obtener elevación usando una API externa
  const getElevation = async (lat, lng) => {
    try {
      // Usar Open Elevation API
      const response = await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
      );

      if (!response.ok) throw new Error('Error obteniendo elevación');

      const data = await response.json();
      return data.results[0]?.elevation || 0;
    } catch (error) {
      console.error('Error obteniendo elevación:', error);
      return 0; // Valor por defecto
    }
  };

  // Función para enviar datos a la API de predicciones personalizadas
  const sendLocationForPrediction = async (location) => {
    try {
      setSearchLoading(true);

      // Obtener elevación
      const elevation = await getElevation(location.latitude, location.longitude);

      // Enviar datos a la API
      const response = await fetch('https://apicallrest-1.onrender.com/predicciones/personalizadas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: location.name || 'Ubicación personalizada',
          lat: location.latitude,
          lng: location.longitude,
          elevation: elevation,
        }),
      });

      if (!response.ok) throw new Error('Error enviando datos');

      const result = await response.json();

      // Guardar la predicción personalizada para mostrarla en el mapa
      const customPredictionData = {
        name: result.name,
        coordinate: result.coordinate,
        riskLevel: result.riskLevel,
        frequency: result.frequency,
        radius: 500, // Radio fijo para la zona personalizada
        color: getRiskColor(result.riskLevel),
        isCustom: true // Marcar como predicción personalizada
      };

      setCustomPrediction(customPredictionData);

      // Animar el mapa principal hacia la nueva predicción
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: result.coordinate.latitude,
          longitude: result.coordinate.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      }

      Alert.alert(
        'Predicción Completada',
        `📍 ${result.name}\n🔍 Riesgo: ${result.riskLevel}\n📊 Probabilidad: ${result.frequency}\n\n✅ La predicción se ha agregado al mapa principal`,
        [
          {
            text: 'Ver en Mapa',
            onPress: () => {
              // Scroll hacia la sección del mapa
              // Aquí puedes implementar scroll automático si es necesario
            }
          },
          { text: 'OK' }
        ]
      );

    } catch (error) {
      console.error('Error enviando predicción:', error);
      Alert.alert('Error', 'No se pudo enviar la predicción personalizada');
    } finally {
      setSearchLoading(false);
    }
  };

  // Función para manejar la selección de un lugar
  const handlePlaceSelect = (place) => {
    // Prevenir el blur temporalmente
    setPreventBlur(true);
    
    setSelectedLocation(place);
    setSearchText(place.name);
    setShowSuggestions(false);
    setSearchInputFocused(false);

    // Animar el mapa de búsqueda al lugar seleccionado
    if (searchMapRef.current) {
      searchMapRef.current.animateToRegion({
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }

    // Resetear la prevención del blur después de un momento
    setTimeout(() => {
      setPreventBlur(false);
    }, 100);
  };

  // Nueva función para manejar el toque en las sugerencias
  const handleSuggestionPress = (place) => {
    // Inmediatamente prevenir comportamientos del blur
    setPreventBlur(true);
    
    // Usar setTimeout para asegurar que se procese después de otros eventos
    setTimeout(() => {
      handlePlaceSelect(place);
    }, 50);
  };

  // Función para confirmar la selección y enviar datos
  const confirmSelection = () => {
    if (selectedLocation) {
      sendLocationForPrediction(selectedLocation);
    }
  };

  // Función para limpiar la predicción personalizada
  const clearCustomPrediction = () => {
    setCustomPrediction(null);
    setSelectedLocation(null);
    setSearchText('');
    Alert.alert('Predicción Eliminada', 'La predicción personalizada ha sido eliminada del mapa');
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Severo': return '#FF4444';
      case 'Moderado': return '#FF8800';
      case 'Leve': return '#FFAA00';
      default: return '#CCCCCC';
    }
  };

  const focusOnZone = (zone) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: zone.coordinate.latitude,
        longitude: zone.coordinate.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E86AB" />
          <Text style={styles.loadingText}>Cargando predicciones...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.backIconContainer}>
              <Text style={styles.backIcon}>←</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Predicciones de Inundación</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Control de Actualización Automática */}
        <View style={styles.autoRefreshContainer}>
          <View style={styles.autoRefreshInfo}>
            <Text style={styles.autoRefreshText}>
              Actualización automática: {autoRefresh ? 'ACTIVA' : 'INACTIVA'}
            </Text>
            {lastUpdateTime && (
              <Text style={styles.lastUpdateText}>
                Última actualización: {formatLastUpdateTime()}
              </Text>
            )}
          </View>
          <Switch
            value={autoRefresh}
            onValueChange={(value) => {
              setAutoRefresh(value);
              if (value) {
                // Mostrar mensaje informativo la primera vez
                Alert.alert(
                  'Actualización Automática Activada',
                  'Los datos se actualizarán cada 5 segundos automáticamente.',
                  [{ text: 'Entendido' }]
                );
              }
            }}
            trackColor={{ false: "#767577", true: "#2E86AB" }}
            thumbColor={autoRefresh ? "#FFFFFF" : "#f4f3f4"}
          />
        </View>

        {/* Gráfica */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Historial de Inundaciones</Text>
          <View style={styles.chartWrapper}>
            <WebView
              source={{ html: chartHTML }}
              style={styles.chart}
              scrollEnabled={false}
              scalesPageToFit={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.sectionTitle}>Buscar Predicción Personalizada</Text>
          <Text style={styles.searchSubtitle}>
            Busca un lugar específico en Querétaro para obtener una predicción de riesgo personalizada
          </Text>

          <View style={styles.searchInputContainer}>
            <TextInput
              style={[
                styles.searchInput,
                searchInputFocused && styles.searchInputFocused
              ]}
              placeholder="Buscar lugar en Querétaro..."
              placeholderTextColor="#999999"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                searchPlaces(text);
              }}
              onFocus={() => {
                setSearchInputFocused(true);
                setPreventBlur(false); // Reset prevent blur cuando se enfoca
                if (searchResults.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // No hacer nada si estamos previniendo el blur
                if (preventBlur) {
                  return;
                }
                
                // Delay más largo para manejar el cierre del teclado
                setTimeout(() => {
                  if (!preventBlur) { // Verificar nuevamente después del delay
                    setSearchInputFocused(false);
                    if (!selectedLocation) {
                      setShowSuggestions(false);
                    }
                  }
                }, 300);
              }}
              blurOnSubmit={false}
              returnKeyType="search" // Cambiar el botón del teclado a "buscar"
            />

            {searchLoading && (
              <ActivityIndicator
                style={styles.searchInputLoader}
                size="small"
                color="#2E86AB"
              />
            )}

            {searchText.length > 0 && !searchLoading && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => {
                  setSearchText('');
                  setSearchResults([]);
                  setShowSuggestions(false);
                  setSelectedLocation(null);
                  setSearchInputFocused(false);
                  setPreventBlur(false);
                }}
              >
                <Text style={styles.clearSearchIcon}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Indicador de ubicación seleccionada */}
          {selectedLocation && (
            <View style={styles.selectedLocationIndicator}>
              <Text style={styles.selectedLocationText}>
                📍 Ubicación seleccionada
              </Text>
              <Text style={styles.selectedLocationAddress}>
                {selectedLocation.fullAddress}
              </Text>
            </View>
          )}

          {/* Indicador de predicción personalizada activa */}
          {customPrediction && (
            <View style={styles.customPredictionIndicator}>
              <View style={styles.customPredictionHeader}>
                <Text style={styles.customPredictionTitle}>
                  ✨ Predicción Personalizada Activa
                </Text>
                <TouchableOpacity
                  style={styles.clearCustomButton}
                  onPress={clearCustomPrediction}
                >
                  <Text style={styles.clearCustomIcon}>×</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.customPredictionContent}>
                <Text style={styles.customPredictionLocation}>
                  📍 {customPrediction.name}
                </Text>
                <Text style={[
                  styles.customPredictionRisk,
                  { color: customPrediction.color }
                ]}>
                  🔍 Riesgo: {customPrediction.riskLevel}
                </Text>
                <Text style={styles.customPredictionFrequency}>
                  📊 Probabilidad: {customPrediction.frequency}
                </Text>
                <Text style={styles.customPredictionNote}>
                  * Visible en el mapa principal
                </Text>
              </View>
            </View>
          )}

          {/* Sugerencias mejoradas */}
          {showSuggestions && searchResults.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always" // Crítico: permite tocar las sugerencias
                keyboardDismissMode="none" // No cerrar teclado al hacer scroll
              >
                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id.toString()}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(item)}
                    onPressIn={() => setPreventBlur(true)} // Prevenir blur al tocar
                    activeOpacity={0.7}
                    delayPressIn={0}
                    delayPressOut={100} // Pequeño delay para asegurar el procesamiento
                  >
                    <View style={styles.suggestionIcon} />
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionName}>
                        {item.name}
                      </Text>
                      <Text style={styles.suggestionAddress} numberOfLines={2}>
                        {item.fullAddress}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Mensaje cuando no hay resultados */}
          {searchText.length > 2 && !searchLoading && searchResults.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsIcon}>🔍</Text>
              <Text style={styles.noResultsText}>
                No se encontraron resultados para "{searchText}"
              </Text>
            </View>
          )}

          {/* Mapa de búsqueda con overlay de carga */}
          <View style={styles.searchMapWrapper}>
            <MapView
              ref={searchMapRef}
              style={styles.searchMap}
              initialRegion={initialRegion}
              showsUserLocation={true}
              showsMyLocationButton={false}
              mapType="standard"
            >
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                  title={selectedLocation.name}
                  description="Ubicación seleccionada"
                  pinColor="#2E86AB"
                />
              )}
            </MapView>

            {searchLoading && (
              <View style={styles.searchLoadingOverlay}>
                <ActivityIndicator size="large" color="#2E86AB" />
                <Text style={styles.searchLoadingText}>
                  Procesando ubicación...
                </Text>
              </View>
            )}
          </View>

          {/* Botón de confirmación mejorado */}
          {selectedLocation && (
            <TouchableOpacity
              style={[
                styles.confirmButton,
                confirmButtonPressed && styles.confirmButtonPressed,
                searchLoading && styles.confirmButtonDisabled
              ]}
              onPress={confirmSelection}
              onPressIn={() => setConfirmButtonPressed(true)}
              onPressOut={() => setConfirmButtonPressed(false)}
              disabled={searchLoading}
              activeOpacity={0.8}
            >
              {searchLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  ✨ Obtener Predicción
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Zonas de Riesgo */}
        <View style={styles.riskContainer}>
          <Text style={styles.sectionTitle}>Zonas de Mayor Riesgo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.riskScrollView}>
            {/* Zonas predefinidas */}
            {predictionZones.map((zone, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.riskCard, { borderLeftColor: getRiskColor(zone.riskLevel) }]}
                onPress={() => focusOnZone(zone)}
              >
                <Text style={styles.riskZoneName}>{zone.name}</Text>
                <Text style={[styles.riskLevel, { color: getRiskColor(zone.riskLevel) }]}>
                  Riesgo {zone.riskLevel}
                </Text>
                <Text style={styles.riskFrequency}>
                  Probabilidad: {zone.frequency}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Zona personalizada */}
            {customPrediction && (
              <TouchableOpacity
                style={[
                  styles.riskCard,
                  styles.customRiskCard,
                  { borderLeftColor: customPrediction.color }
                ]}
                onPress={() => focusOnZone(customPrediction)}
              >
                <Text style={styles.customRiskLabel}>✨ PERSONALIZADA</Text>
                <Text style={styles.riskZoneName} numberOfLines={2}>
                  {customPrediction.name}
                </Text>
                <Text style={[styles.riskLevel, { color: customPrediction.color }]}>
                  Riesgo {customPrediction.riskLevel}
                </Text>
                <Text style={styles.riskFrequency}>
                  Probabilidad: {customPrediction.frequency}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Mapa Predictivo */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Mapa de Predicción</Text>
          <Text style={styles.mapSubtitle}>
            Las zonas coloreadas indican mayor probabilidad de inundación
            {customPrediction && ' (incluye tu predicción personalizada)'}
          </Text>

          <View style={styles.mapWrapper}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={true}
              showsMyLocationButton={false}
              mapType="standard"
            >
              {/* Marcadores de zonas de riesgo predefinidas */}
              {predictionZones.map((zone, index) => {
                const pinColor = getRiskColor(zone.riskLevel);
                return (
                  <React.Fragment key={`${index}-${zone.riskLevel}`}>
                    <Circle
                      center={zone.coordinate}
                      radius={zone.radius}
                      fillColor={`${pinColor}40`}
                      strokeColor={pinColor}
                      strokeWidth={2}
                    />
                    <Marker
                      coordinate={zone.coordinate}
                      title={String(zone.name)}
                      description={String(`Riesgo ${zone.riskLevel} - Probabilidad: ${zone.frequency}`)}
                      pinColor={pinColor}
                    />
                  </React.Fragment>
                );
              })}

              {/* Marcador y círculo de predicción personalizada */}
              {customPrediction && (
                <React.Fragment key={`custom-${customPrediction.riskLevel}`}>
                  <Circle
                    center={customPrediction.coordinate}
                    radius={customPrediction.radius}
                    fillColor={`${customPrediction.color}60`}
                    strokeColor={customPrediction.color}
                    strokeWidth={3}
                    strokePattern={[10, 10]}
                  />
                  <Marker
                    coordinate={customPrediction.coordinate}
                    title={`✨ ${customPrediction.name}`}
                    description={`Predicción Personalizada - Riesgo ${customPrediction.riskLevel}`}
                    pinColor={customPrediction.color}
                  />
                </React.Fragment>
              )}
            </MapView>
          </View>

          {/* Leyenda del mapa actualizada */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Leyenda:</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF4444' }]} />
              <Text style={styles.legendText}>Riesgo Severo</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF8800' }]} />
              <Text style={styles.legendText}>Riesgo Moderado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFAA00' }]} />
              <Text style={styles.legendText}>Riesgo Leve</Text>
            </View>
            {customPrediction && (
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#2E86AB' }]} />
                <Text style={styles.legendText}>Predicción Personalizada</Text>
              </View>
            )}
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Sobre las Predicciones</Text>
          <Text style={styles.infoText}>
            Las predicciones se basan en análisis en tiempo real de condiciones climáticas
            y elevación en Querétaro. Las zonas marcadas en rojo tienen mayor
            probabilidad de inundación durante la temporada de lluvias.
          </Text>
          <Text style={styles.infoText}>
            Las predicciones personalizadas utilizan inteligencia artificial para analizar
            ubicaciones específicas basándose en coordenadas y elevación.
          </Text>
          <Text style={styles.infoText}>
            Recomendamos especial precaución en estas áreas durante alertas meteorológicas.
          </Text>
          {autoRefresh && (
            <Text style={styles.infoText}>
              ⚡ La actualización automática está activa. Los datos se refrescan cada 5 segundos.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrediccionesScreen;