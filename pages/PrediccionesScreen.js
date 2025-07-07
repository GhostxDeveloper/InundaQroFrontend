
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
} from 'react-native';
import MapView, { Marker, Heatmap, Circle } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { styles } from '../styles/PredictionStyles';

const { width, height } = Dimensions.get('window');

const PrediccionesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [floodData, setFloodData] = useState([]);
  const [predictionZones, setPredictionZones] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('5years');

  const mapRef = useRef(null);

  // Datos simulados de inundaciones en Querétaro (últimos 5 años)
  const mockFloodData = [
    {
      year: 2024,
      month: 'Septiembre',
      incidents: 8,
      zones: [
        { name: 'Centro Histórico', lat: 20.5888, lng: -100.38806, severity: 'Moderado' },
        { name: 'Col. Félix Osores', lat: 20.5756, lng: -100.3789, severity: 'Severo' },
        { name: 'Col. Jardines de Querétaro', lat: 20.6012, lng: -100.4123, severity: 'Leve' },
      ]
    },
    {
      year: 2023,
      month: 'Agosto',
      incidents: 12,
      zones: [
        { name: 'Centro Histórico', lat: 20.5888, lng: -100.38806, severity: 'Severo' },
        { name: 'Col. Casa Blanca', lat: 20.5634, lng: -100.3567, severity: 'Moderado' },
        { name: 'Juriquilla', lat: 20.6130, lng: -100.4050, severity: 'Leve' },
      ]
    },
    {
      year: 2022,
      month: 'Julio',
      incidents: 6,
      zones: [
        { name: 'Col. Félix Osores', lat: 20.5756, lng: -100.3789, severity: 'Moderado' },
        { name: 'Col. San Francisquito', lat: 20.5445, lng: -100.3912, severity: 'Leve' },
      ]
    },
    {
      year: 2021,
      month: 'Septiembre',
      incidents: 15,
      zones: [
        { name: 'Centro Histórico', lat: 20.5888, lng: -100.38806, severity: 'Severo' },
        { name: 'Col. Casa Blanca', lat: 20.5634, lng: -100.3567, severity: 'Severo' },
        { name: 'Col. Jardines de Querétaro', lat: 20.6012, lng: -100.4123, severity: 'Moderado' },
      ]
    },
    {
      year: 2020,
      month: 'Agosto',
      incidents: 9,
      zones: [
        { name: 'Col. Félix Osores', lat: 20.5756, lng: -100.3789, severity: 'Severo' },
        { name: 'Juriquilla', lat: 20.6130, lng: -100.4050, severity: 'Moderado' },
      ]
    }
  ];

  // Zonas de mayor riesgo basadas en datos históricos
  const highRiskZones = [
    {
      name: 'Centro Histórico',
      coordinate: { latitude: 20.5888, longitude: -100.38806 },
      riskLevel: 'Alto',
      frequency: 4,
      radius: 800,
      color: '#FF4444',
    },
    {
      name: 'Col. Félix Osores',
      coordinate: { latitude: 20.5756, longitude: -100.3789 },
      riskLevel: 'Alto',
      frequency: 4,
      radius: 600,
      color: '#FF4444',
    },
    {
      name: 'Col. Casa Blanca',
      coordinate: { latitude: 20.5634, longitude: -100.3567 },
      riskLevel: 'Medio',
      frequency: 2,
      radius: 500,
      color: '#FF8800',
    },
    {
      name: 'Col. Jardines de Querétaro',
      coordinate: { latitude: 20.6012, longitude: -100.4123 },
      riskLevel: 'Medio',
      frequency: 2,
      radius: 500,
      color: '#FF8800',
    },
    {
      name: 'Juriquilla',
      coordinate: { latitude: 20.6130, longitude: -100.4050 },
      riskLevel: 'Bajo',
      frequency: 2,
      radius: 400,
      color: '#FFAA00',
    },
  ];

  // Región inicial de Querétaro
  const initialRegion = {
    latitude: 20.5888,
    longitude: -100.38806,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  // HTML para la gráfica de Highcharts
  const chartHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <style>
            body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
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
                        dataLabels: {
                            enabled: true
                        }
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

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);

      // Obtener ubicación actual
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
      }

      // Simular carga de datos
      setTimeout(() => {
        setFloodData(mockFloodData);
        setPredictionZones(highRiskZones);
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error inicializando datos:', error);
      setLoading(false);
      Alert.alert('Error', 'No se pudieron cargar los datos de predicción');
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Alto': return '#FF4444';
      case 'Medio': return '#FF8800';
      case 'Bajo': return '#FFAA00';
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
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Predicciones de Inundación</Text>
          <View style={styles.placeholder} />
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

        {/* Zonas de Riesgo */}
        <View style={styles.riskContainer}>
          <Text style={styles.sectionTitle}>Zonas de Mayor Riesgo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.riskScrollView}>
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
                  {zone.frequency} incidentes en 5 años
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mapa Predictivo */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Mapa de Predicción</Text>
          <Text style={styles.mapSubtitle}>
            Las zonas coloreadas indican mayor probabilidad de inundación
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
              {/* Marcadores de zonas de riesgo */}
              {predictionZones.map((zone, index) => (
                <React.Fragment key={index}>
                  <Circle
                    center={zone.coordinate}
                    radius={zone.radius}
                    fillColor={`${zone.color}40`}
                    strokeColor={zone.color}
                    strokeWidth={2}
                  />
                  <Marker
                    coordinate={zone.coordinate}
                    title={zone.name}
                    description={`Riesgo ${zone.riskLevel} - ${zone.frequency} incidentes`}
                    pinColor={zone.color}
                  />
                </React.Fragment>
              ))}
            </MapView>
          </View>

          {/* Leyenda del mapa */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Leyenda:</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF4444' }]} />
              <Text style={styles.legendText}>Riesgo Alto</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF8800' }]} />
              <Text style={styles.legendText}>Riesgo Medio</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFAA00' }]} />
              <Text style={styles.legendText}>Riesgo Bajo</Text>
            </View>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Sobre las Predicciones</Text>
          <Text style={styles.infoText}>
            Las predicciones se basan en el análisis de patrones históricos de inundaciones
            en Querétaro durante los últimos 5 años. Las zonas marcadas en rojo tienen mayor
            probabilidad de inundación durante la temporada de lluvias.
          </Text>
          <Text style={styles.infoText}>
            Recomendamos especial precaución en estas áreas durante alertas meteorológicas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrediccionesScreen;