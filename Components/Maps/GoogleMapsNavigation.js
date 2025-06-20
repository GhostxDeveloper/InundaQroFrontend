import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const GoogleMapsNavigation = ({
  userLocation,
  destination,
  isActive,
  onDirectionsReady,
  onDirectionsError,
  onNavigationUpdate,
  mapRef: externalMapRef,
  style,
}) => {
  // Estados para navegación
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [distanceToNextTurn, setDistanceToNextTurn] = useState(0);
  const [estimatedTimeArrival, setEstimatedTimeArrival] = useState('');
  const [totalDistance, setTotalDistance] = useState('');
  const [currentBearing, setCurrentBearing] = useState(0);
  const [speed, setSpeed] = useState(0);

  // Referencias
  const mapRef = useRef(null);
  const locationWatcher = useRef(null);
  const bearingAnimation = useRef(new Animated.Value(0)).current;

  // Configuración de navegación como Google Maps
  const NAVIGATION_CONFIG = {
    zoom: 19, // Muy cerca como Google Maps
    pitch: 65, // Ángulo de inclinación
    followUserDelay: 800, // Suavidad de seguimiento
    bearingUpdateThreshold: 5, // Grados mínimos para actualizar bearing
    stepCompletionDistance: 30, // Metros para considerar paso completado
    recalculateDistance: 100, // Metros para recalcular ruta
  };

  useEffect(() => {
    if (isActive && userLocation && destination) {
      initializeNavigation();
      startLocationTracking();
    } else {
      stopNavigation();
    }

    return () => {
      stopLocationTracking();
    };
  }, [isActive, userLocation, destination]);

  // Función para calcular bearing entre dos puntos
  const calculateBearing = (start, end) => {
    const lat1 = (start.latitude * Math.PI) / 180;
    const lat2 = (end.latitude * Math.PI) / 180;
    const deltaLng = ((end.longitude - start.longitude) * Math.PI) / 180;

    const x = Math.sin(deltaLng) * Math.cos(lat2);
    const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    let bearing = (Math.atan2(x, y) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  // Función para calcular distancia entre dos puntos
  const calculateDistance = (point1, point2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Inicializar navegación
  const initializeNavigation = async () => {
    try {
      await getDirections();
    } catch (error) {
      console.error('Error inicializando navegación:', error);
      onDirectionsError?.('Error al calcular la ruta');
    }
  };

  // Obtener direcciones de Google Directions API
  const getDirections = async () => {
    try {
      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const dest = `${destination.latitude},${destination.longitude}`;
      
      // Aquí deberías usar tu API key de Google
      const API_KEY = 'TU_GOOGLE_MAPS_API_KEY';
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${API_KEY}&mode=driving&alternatives=false&language=es`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];
        
        // Decodificar polyline
        const coordinates = decodePolyline(route.overview_polyline.points);
        setRouteCoordinates(coordinates);

        // Procesar pasos de navegación
        const steps = leg.steps.map((step, index) => ({
          index,
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remover HTML tags
          distance: step.distance.text,
          duration: step.duration.text,
          maneuver: step.maneuver || 'straight',
          startLocation: {
            latitude: step.start_location.lat,
            longitude: step.start_location.lng,
          },
          endLocation: {
            latitude: step.end_location.lat,
            longitude: step.end_location.lng,
          },
        }));

        setNavigationSteps(steps);
        setCurrentInstruction(steps[0]?.instruction || 'Continúa por esta vía');
        setTotalDistance(leg.distance.text);
        setEstimatedTimeArrival(leg.duration.text);

        // Callback con datos de la ruta
        onDirectionsReady?.({
          distance: leg.distance.value / 1000, // km
          duration: leg.duration.value / 60, // minutos
          steps: steps.length,
        });

        // Configurar vista inicial
        updateCameraForNavigation();
      }
    } catch (error) {
      console.error('Error obteniendo direcciones:', error);
      onDirectionsError?.('Error al obtener las direcciones');
    }
  };

  // Decodificar polyline de Google
  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      lat += ((result & 1) ? ~(result >> 1) : (result >> 1));

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      lng += ((result & 1) ? ~(result >> 1) : (result >> 1));

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  // Seguimiento de ubicación para navegación
  const startLocationTracking = async () => {
    try {
      locationWatcher.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 500, // Actualización cada 500ms para navegación fluida
          distanceInterval: 2, // Cada 2 metros
        },
        (newLocation) => {
          const currentPos = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };

          updateNavigationProgress(currentPos, newLocation.coords.speed || 0);
          updateCameraForNavigation(currentPos, newLocation.coords.heading);
        }
      );
    } catch (error) {
      console.error('Error iniciando seguimiento:', error);
    }
  };

  // Actualizar progreso de navegación
  const updateNavigationProgress = (currentPosition, currentSpeed) => {
    if (navigationSteps.length === 0) return;

    setSpeed(currentSpeed * 3.6); // Convertir m/s a km/h

    const currentStep = navigationSteps[currentStepIndex];
    if (!currentStep) return;

    // Calcular distancia al siguiente giro
    const distanceToTurn = calculateDistance(currentPosition, currentStep.endLocation);
    setDistanceToNextTurn(Math.round(distanceToTurn));

    // Verificar si completamos este paso
    if (distanceToTurn < NAVIGATION_CONFIG.stepCompletionDistance) {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < navigationSteps.length) {
        setCurrentStepIndex(nextStepIndex);
        setCurrentInstruction(navigationSteps[nextStepIndex].instruction);
        
        // Notificar cambio de instrucción
        onNavigationUpdate?.({
          currentStep: nextStepIndex,
          instruction: navigationSteps[nextStepIndex].instruction,
          distanceToTurn: Math.round(calculateDistance(currentPosition, navigationSteps[nextStepIndex].endLocation)),
        });
      }
    }

    // Calcular bearing hacia el siguiente punto
    let targetPoint = currentStep.endLocation;
    if (routeCoordinates.length > 0) {
      // Encontrar el punto más cercano en la ruta
      const closestPoint = findClosestPointOnRoute(currentPosition);
      if (closestPoint.index < routeCoordinates.length - 5) {
        targetPoint = routeCoordinates[closestPoint.index + 5]; // Mirar 5 puntos adelante
      }
    }

    const newBearing = calculateBearing(currentPosition, targetPoint);
    updateBearing(newBearing);
  };

  // Encontrar punto más cercano en la ruta
  const findClosestPointOnRoute = (currentPosition) => {
    let closestDistance = Infinity;
    let closestIndex = 0;

    routeCoordinates.forEach((point, index) => {
      const distance = calculateDistance(currentPosition, point);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return { index: closestIndex, distance: closestDistance };
  };

  // Actualizar bearing con animación suave
  const updateBearing = (newBearing) => {
    const difference = Math.abs(newBearing - currentBearing);
    
    if (difference > NAVIGATION_CONFIG.bearingUpdateThreshold) {
      setCurrentBearing(newBearing);
      
      Animated.timing(bearingAnimation, {
        toValue: newBearing,
        duration: NAVIGATION_CONFIG.followUserDelay,
        useNativeDriver: false,
      }).start();
    }
  };

  // Actualizar cámara para navegación
  const updateCameraForNavigation = (position = userLocation, heading = currentBearing) => {
    if (!position) return;

    const targetRef = externalMapRef || mapRef;
    if (targetRef?.current) {
      targetRef.current.animateCamera({
        center: {
          latitude: position.latitude,
          longitude: position.longitude,
        },
        pitch: NAVIGATION_CONFIG.pitch,
        heading: heading || currentBearing,
        zoom: NAVIGATION_CONFIG.zoom,
        altitude: 200,
      }, NAVIGATION_CONFIG.followUserDelay);
    }
  };

  // Detener navegación
  const stopNavigation = () => {
    if (locationWatcher.current) {
      locationWatcher.current.remove();
      locationWatcher.current = null;
    }
  };

  const stopLocationTracking = () => {
    stopNavigation();
  };

  // Obtener icono de maniobra
  const getManeuverIcon = (maneuver) => {
    const icons = {
      'turn-left': '↰',
      'turn-right': '↱',
      'turn-slight-left': '↰',
      'turn-slight-right': '↱',
      'turn-sharp-left': '↰',
      'turn-sharp-right': '↱',
      'uturn-left': '↶',
      'uturn-right': '↷',
      'straight': '↑',
      'ramp-left': '↰',
      'ramp-right': '↱',
      'merge': '↗',
      'fork-left': '↰',
      'fork-right': '↱',
      'ferry': '⛴',
      'roundabout-left': '↻',
      'roundabout-right': '↺',
    };
    return icons[maneuver] || '↑';
  };

  if (!isActive) return null;

  return (
    <View style={[styles.container, style]}>
      {/* Instrucciones de navegación */}
      <View style={styles.instructionPanel}>
        <View style={styles.instructionHeader}>
          <View style={styles.maneuverIcon}>
            <Text style={styles.maneuverText}>
              {getManeuverIcon(navigationSteps[currentStepIndex]?.maneuver)}
            </Text>
          </View>
          <View style={styles.instructionInfo}>
            <Text style={styles.instructionText} numberOfLines={2}>
              {currentInstruction}
            </Text>
            <Text style={styles.distanceText}>
              En {distanceToNextTurn}m
            </Text>
          </View>
        </View>
        
        <View style={styles.routeInfo}>
          <Text style={styles.etaText}>{estimatedTimeArrival}</Text>
          <Text style={styles.distanceInfo}>{totalDistance}</Text>
          {speed > 0 && (
            <Text style={styles.speedText}>{Math.round(speed)} km/h</Text>
          )}
        </View>
      </View>

      {/* Mapa de navegación (solo si no se proporciona referencia externa) */}
      {!externalMapRef && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          showsIndoors={false}
          showsTraffic={true}
          followsUserLocation={true}
          userLocationPriority="high"
          userLocationUpdateInterval={500}
        >
          {/* Ruta */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={6}
              strokeColor="#4285F4"
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Marcador de destino */}
          {destination && (
            <Marker
              coordinate={destination}
              title="Destino"
              pinColor="#EA4335"
            />
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  instructionPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  maneuverIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  maneuverText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionInfo: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  etaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
  },
  distanceInfo: {
    fontSize: 14,
    color: '#666',
  },
  speedText: {
    fontSize: 14,
    color: '#34A853',
    fontWeight: '500',
  },
});

export default GoogleMapsNavigation;