import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import MapView, { Marker, Heatmap, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { styles } from '../styles/PredictionStyles';
import { 
  getAllFloodReports, 
  subscribeToFloodReports, 
  getSeverityColor,
  getSeverityEmoji,
  getReportsInRadius 
} from '../services/floodReportsService';

const { width, height } = Dimensions.get('window');

const PrediccionesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [floodReports, setFloodReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 20.5888,
    longitude: -100.38806,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState('5years');

  const mapRef = useRef(null);
  const reportsUnsubscribe = useRef(null);

  // Datos históricos de inundaciones en Querétaro
  const historicalFloodData = [
    { year: 2019, zone: 'Centro Histórico', incidents: 8, lat: 20.5931, lng: -100.3931, severity: 'Moderado' },
    { year: 2019, zone: 'Constituyentes', incidents: 12, lat: 20.6097, lng: -100.4108, severity: 'Severo' },
    { year: 2019, zone: 'El Pueblito', incidents: 6, lat: 20.5469, lng: -100.4486, severity: 'Leve' },
    { year: 2019, zone: 'Juriquilla', incidents: 4, lat: 20.6847, lng: -100.4397, severity: 'Leve' },
    { year: 2020, zone: 'Centro Histórico', incidents: 15, lat: 20.5931, lng: -100.3931, severity: 'Severo' },
    { year: 2020, zone: 'Constituyentes', incidents: 18, lat: 20.6097, lng: -100.4108, severity: 'Severo' },
    { year: 2020, zone: 'Juriquilla', incidents: 9, lat: 20.6847, lng: -100.4397, severity: 'Moderado' },
    { year: 2020, zone: 'El Pueblito', incidents: 11, lat: 20.5469, lng: -100.4486, severity: 'Moderado' },
    { year: 2021, zone: 'El Pueblito', incidents: 11, lat: 20.5469, lng: -100.4486, severity: 'Moderado' },
    { year: 2021, zone: 'Constituyentes', incidents: 22, lat: 20.6097, lng: -100.4108, severity: 'Severo' },
    { year: 2021, zone: 'Candiles', incidents: 7, lat: 20.5561, lng: -100.3622, severity: 'Leve' },
    { year: 2021, zone: 'Centro Histórico', incidents: 13, lat: 20.5931, lng: -100.3931, severity: 'Moderado' },
    { year: 2022, zone: 'Centro Histórico', incidents: 10, lat: 20.5931, lng: -100.3931, severity: 'Moderado' },
    { year: 2022, zone: 'Constituyentes', incidents: 25, lat: 20.6097, lng: -100.4108, severity: 'Severo' },
    { year: 2022, zone: 'Juriquilla', incidents: 14, lat: 20.6847, lng: -100.4397, severity: 'Moderado' },
    { year: 2022, zone: 'Candiles', incidents: 9, lat: 20.5561, lng: -100.3622, severity: 'Moderado' },
    { year: 2023, zone: 'El Pueblito', incidents: 16, lat: 20.5469, lng: -100.4486, severity: 'Severo' },
    { year: 2023, zone: 'Constituyentes', incidents: 28, lat: 20.6097, lng: -100.4108, severity: 'Severo' },
    { year: 2023, zone: 'Centro Histórico', incidents: 13, lat: 20.5931, lng: -100.3931, severity: 'Moderado' },
    { year: 2023, zone: 'Juriquilla', incidents: 17, lat: 20.6847, lng: -100.4397, severity: 'Severo' },
  ];

  // Procesar datos para la gráfica
  const processDataForChart = () => {
    const zones = [...new Set(historicalFloodData.map(item => item.zone))];
    const years = [2019, 2020, 2021, 2022, 2023];
    
    return {
      labels: years.map(year => year.toString()),
      datasets: zones.map(zone => ({
        data: years.map(year => {
          const item = historicalFloodData.find(d => d.zone === zone && d.year === year);
          return item ? item.incidents : 0;
        }),
        color: (opacity = 1) => getZoneColor(zone, opacity),
        strokeWidth: 2
      })),
      legend: zones
    };
  };

  // Asignar colores por zona
  const getZoneColor = (zone, opacity = 1) => {
    const colors = {
      'Centro Histórico': `rgba(255, 107, 107, ${opacity})`,
      'Constituyentes': `rgba(255, 71, 87, ${opacity})`,
      'El Pueblito': `rgba(69, 183, 209, ${opacity})`,
      'Juriquilla': `rgba(38, 222, 129, ${opacity})`,
      'Candiles': `rgba(255, 167, 38, ${opacity})`
    };
    return colors[zone] || `rgba(116, 185, 255, ${opacity})`;
  };

  // Generar marcadores para el mapa
  const generateMapMarkers = () => {
    const zoneIncidents = {};
    
    historicalFloodData.forEach(item => {
      if (!zoneIncidents[item.zone]) {
        zoneIncidents[item.zone] = {
          total: 0,
          lat: item.lat,
          lng: item.lng,
          zone: item.zone,
          severityData: { Leve: 0, Moderado: 0, Severo: 0 }
        };
      }
      zoneIncidents[item.zone].total += item.incidents;
      zoneIncidents[item.zone].severityData[item.severity] += item.incidents;
    });

    return Object.values(zoneIncidents);
  };

  // Generar datos de heatmap
  const generateHeatmapData = () => {
    return generateMapMarkers().map(marker => ({
      latitude: marker.lat,
      longitude: marker.lng,
      weight: Math.min(marker.total / 5, 10),
    }));
  };

  // Cargar reportes actuales
  const loadFloodReports = async () => {
    setLoadingReports(true);
    try {
      const reports = await getAllFloodReports();
      setFloodReports(reports);
    } catch (error) {
      console.error('Error loading flood reports:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes actuales');
    } finally {
      setLoadingReports(false);
    }
  };

  // Obtener ubicación actual
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Se necesita acceso a la ubicación para mostrar predicciones precisas');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      if (Math.abs(location.coords.latitude - 20.5888) < 0.5) {
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadFloodReports(),
      getCurrentLocation()
    ]);
    setRefreshing(false);
  };

  // Calcular estadísticas
  const calculateTotalIncidents = () => {
    return historicalFloodData.reduce((sum, item) => sum + item.incidents, 0);
  };

  const getMostAffectedZone = () => {
    const zoneIncidents = {};
    historicalFloodData.forEach(item => {
      zoneIncidents[item.zone] = (zoneIncidents[item.zone] || 0) + item.incidents;
    });
    
    return Object.keys(zoneIncidents).reduce((a, b) => 
      zoneIncidents[a] > zoneIncidents[b] ? a : b
    );
  };

  const getAffectedZonesCount = () => {
    return [...new Set(historicalFloodData.map(item => item.zone))].length;
  };

  useEffect(() => {
    loadFloodReports();
    getCurrentLocation();
    
    reportsUnsubscribe.current = subscribeToFloodReports((updatedReports) => {
      setFloodReports(updatedReports);
    });

    return () => {
      if (reportsUnsubscribe.current) {
        reportsUnsubscribe.current();
      }
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Analizando datos de inundaciones...</Text>
      </SafeAreaView>
    );
  }

  const chartData = processDataForChart();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      <ScrollView 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
      >
        {/* Gráfica de barras */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Historial de Inundaciones (2019-2023)</Text>
          <BarChart
            data={chartData}
            width={width - 40}
            height={300}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726'
              }
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
            showBarTops={false}
            fromZero
          />
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{calculateTotalIncidents()}</Text>
            <Text style={styles.statLabel}>Total Incidentes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getAffectedZonesCount()}</Text>
            <Text style={styles.statLabel}>Zonas Afectadas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{getMostAffectedZone()}</Text>
            <Text style={styles.statLabel}>Zona Crítica</Text>
          </View>
        </View>

        {/* Mapa de predicciones */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Mapa de Riesgo</Text>
          <Text style={styles.mapDescription}>
            Zonas con mayor probabilidad de inundación
          </Text>
          
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={mapRegion}
            showsUserLocation={true}
          >
            <Heatmap
              points={generateHeatmapData()}
              opacity={0.7}
              radius={40}
            />
            
            {generateMapMarkers().map((marker, index) => {
              const riskLevel = marker.total >= 80 ? 'Severo' : marker.total >= 40 ? 'Moderado' : 'Leve';
              return (
                <Marker
                  key={`prediction-${index}`}
                  coordinate={{
                    latitude: marker.lat,
                    longitude: marker.lng,
                  }}
                  pinColor={getSeverityColor(riskLevel)}
                >
                  <Callout>
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutTitle}>
                        {getSeverityEmoji(riskLevel)} {marker.zone}
                      </Text>
                      <Text style={styles.calloutText}>
                        {marker.total} incidentes históricos
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </View>

        {/* Leyenda */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: getSeverityColor('Severo') }]} />
            <Text style={styles.legendText}>Alto Riesgo</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: getSeverityColor('Moderado') }]} />
            <Text style={styles.legendText}>Riesgo Medio</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: getSeverityColor('Leve') }]} />
            <Text style={styles.legendText}>Bajo Riesgo</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrediccionesScreen;