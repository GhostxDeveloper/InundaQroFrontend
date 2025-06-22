import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { styles } from '../../styles/stylesComponentsMap/GuidedNavigationStyles';
import { 
  getAllFloodReports, 
  subscribeToFloodReports,
  getSeverityColor,
  getSeverityEmoji
} from '../../services/floodReportsService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyD6vEAeGtBjMT1zQUlFnuvJV9YORgXSFGk';

const GuidedNavigation = ({
  origin,
  destination,
  destinationName,
  onNavigationComplete,
  onNavigationCancel,
  mapType = 'standard',
  showTraffic = true,
  showFloodReports = true, // Nueva prop para controlar si mostrar reportes
  selectedSeverityFilter = 'all', // Nueva prop para filtrar por severidad
}) => {
  // Estados principales
  const [currentLocation, setCurrentLocation] = useState(origin);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [routeInfo, setRouteInfo] = useState({
    distance: '',
    duration: '',
    remainingDistance: '',
    remainingTime: '',
    eta: '',
  });
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [nextInstruction, setNextInstruction] = useState('');
  const [currentStreet, setCurrentStreet] = useState('');
  const [maneuverType, setManeuverType] = useState('');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [navigationActive, setNavigationActive] = useState(true);
  const [userHeading, setUserHeading] = useState(0);
  const [speedInfo, setSpeedInfo] = useState({ speed: 0, speedLimit: null });

  // Estados para reportes de inundación
  const [floodReports, setFloodReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [floodWarningShown, setFloodWarningShown] = useState(false);

  // Referencias
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);
  const reportsUnsubscribe = useRef(null);
  const instructionAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Efecto para inicializar la navegación
  useEffect(() => {
    initializeNavigation();
    startLocationTracking();
    startInstructionAnimation();
    loadFloodReports();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (reportsUnsubscribe.current) {
        reportsUnsubscribe.current();
      }
    };
  }, []);

  // Efecto para recalcular cuando cambia la ubicación
  useEffect(() => {
    if (currentLocation && navigationActive) {
      checkIfNeedRecalculation();
      updateRemainingInfo();
      checkFloodWarnings();
    }
  }, [currentLocation, navigationSteps, currentStepIndex, floodReports]);

  const initializeNavigation = () => {
    setCurrentInstruction('Calculando la mejor ruta...');
    setCurrentLocation(origin);
    
    // Configurar vista inicial del mapa
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: origin,
        pitch: 60,
        heading: 0,
        altitude: 500,
        zoom: 18,
      }, 1000);
    }
  };

  const loadFloodReports = async () => {
    try {
      setLoadingReports(true);
      
      // Suscribirse a los reportes en tiempo real
      reportsUnsubscribe.current = subscribeToFloodReports((reports) => {
        setFloodReports(reports);
        setLoadingReports(false);
      });
      
    } catch (error) {
      console.error('Error cargando reportes de inundación:', error);
      setLoadingReports(false);
      
      // Fallback: intentar cargar reportes una sola vez
      try {
        const reports = await getAllFloodReports();
        setFloodReports(reports);
      } catch (fallbackError) {
        console.error('Error en fallback de reportes:', fallbackError);
      }
    }
  };

  const getFilteredReports = () => {
    if (selectedSeverityFilter === 'all') {
      return floodReports;
    }
    return floodReports.filter(report => report.severityLevel === selectedSeverityFilter);
  };

  const checkFloodWarnings = () => {
    if (!currentLocation || floodWarningShown) return;

    const nearbyFloodReports = getFilteredReports().filter(report => {
      const distance = calculateDistance(
        currentLocation,
        { latitude: report.location.latitude, longitude: report.location.longitude }
      );
      return distance <= 0.5; // Alertar si hay inundación a menos de 500 metros
    });

    if (nearbyFloodReports.length > 0 && !floodWarningShown) {
      const severeReports = nearbyFloodReports.filter(report => report.severityLevel === 'Severo');
      
      if (severeReports.length > 0) {
        setFloodWarningShown(true);
        Alert.alert(
          '🚨 Alerta de Inundación Severa',
          `Hay ${severeReports.length} reporte(s) de inundación severa en tu ruta. Se recomienda precaución o considerar una ruta alternativa.`,
          [
            { 
              text: 'Recalcular Ruta', 
              onPress: () => {
                recalculateRoute();
                setFloodWarningShown(false);
              }
            },
            { 
              text: 'Continuar con Precaución', 
              onPress: () => setFloodWarningShown(false)
            }
          ]
        );
      } else {
        setFloodWarningShown(true);
        Alert.alert(
          '⚠️ Alerta de Inundación',
          `Hay reportes de inundación cerca de tu ruta. Mantente alerta.`,
          [
            { text: 'Entendido', onPress: () => setFloodWarningShown(false) }
          ]
        );
      }
    }
  };

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de ubicación para la navegación');
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          
          setCurrentLocation(newLocation);
          setUserHeading(location.coords.heading || 0);
          setSpeedInfo({
            speed: location.coords.speed ? (location.coords.speed * 3.6).toFixed(0) : 0, // m/s to km/h
            speedLimit: speedInfo.speedLimit,
          });

          // Actualizar cámara del mapa para seguir al usuario
          if (mapRef.current && navigationActive) {
            mapRef.current.animateCamera({
              center: newLocation,
              pitch: 60,
              heading: location.coords.heading || userHeading,
              altitude: 500,
              zoom: 18,
            }, 1000);
          }
        }
      );
    } catch (error) {
      console.error('Error setting up location tracking:', error);
      Alert.alert('Error', 'No se pudo inicializar el seguimiento de ubicación');
    }
  };

  const handleDirectionsReady = (result) => {
    const route = result.legs[0];
    const steps = route.steps;
    
    setNavigationSteps(steps);
    setCurrentStepIndex(0);
    
    // Información general de la ruta
    const totalDistance = (result.distance / 1000).toFixed(1);
    const totalDuration = Math.round(result.duration);
    const eta = new Date(Date.now() + result.duration * 60000);
    
    setRouteInfo({
      distance: `${totalDistance} km`,
      duration: `${totalDuration} min`,
      remainingDistance: `${totalDistance} km`,
      remainingTime: `${totalDuration} min`,
      eta: eta.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    });

    // Primera instrucción
    if (steps.length > 0) {
      updateCurrentInstruction(steps[0]);
      if (steps.length > 1) {
        setNextInstruction(getFormattedInstruction(steps[1]));
      }
    }

    setIsRecalculating(false);
  };

  const handleDirectionsError = (error) => {
    console.error('Directions error:', error);
    setIsRecalculating(false);
    Alert.alert(
      'Error de navegación',
      'No se pudo calcular la ruta. ¿Deseas reintentar?',
      [
        { text: 'Cancelar', onPress: onNavigationCancel },
        { text: 'Reintentar', onPress: () => setIsRecalculating(true) }
      ]
    );
  };

  const updateCurrentInstruction = (step) => {
    const instruction = getFormattedInstruction(step);
    const maneuver = getManeuverType(step.maneuver);
    const street = step.street_name || step.html_instructions?.replace(/<[^>]*>/g, '') || '';
    
    setCurrentInstruction(instruction);
    setManeuverType(maneuver);
    setCurrentStreet(street);
  };

  const getFormattedInstruction = (step) => {
    if (!step) return '';
    
    let instruction = step.html_instructions?.replace(/<[^>]*>/g, '') || '';
    const distance = step.distance ? `en ${step.distance.text}` : '';
    
    // Limpiar y formatear la instrucción
    instruction = instruction
      .replace(/Continúa por/i, 'Continúa por')
      .replace(/Gira a la/i, 'Gira a la')
      .replace(/Mantente/i, 'Mantente')
      .replace(/Toma/i, 'Toma');
    
    return distance ? `${instruction} ${distance}` : instruction;
  };

  const getManeuverType = (maneuver) => {
    if (!maneuver) return 'straight';
    
    const maneuverMap = {
      'turn-left': 'turn-left',
      'turn-right': 'turn-right',
      'turn-slight-left': 'turn-slight-left',
      'turn-slight-right': 'turn-slight-right',
      'turn-sharp-left': 'turn-sharp-left',
      'turn-sharp-right': 'turn-sharp-right',
      'uturn-left': 'uturn',
      'uturn-right': 'uturn',
      'continue': 'straight',
      'merge': 'merge',
      'on-ramp': 'on-ramp',
      'off-ramp': 'off-ramp',
      'fork-left': 'fork-left',
      'fork-right': 'fork-right',
      'roundabout-left': 'roundabout',
      'roundabout-right': 'roundabout',
    };
    
    return maneuverMap[maneuver] || 'straight';
  };

  const getManeuverIcon = (maneuver) => {
    const iconMap = {
      'straight': '⬆️',
      'turn-left': '⬅️',
      'turn-right': '➡️',
      'turn-slight-left': '↖️',
      'turn-slight-right': '↗️',
      'turn-sharp-left': '↰',
      'turn-sharp-right': '↱',
      'uturn': '↩️',
      'merge': '🔀',
      'on-ramp': '↗️',
      'off-ramp': '↘️',
      'fork-left': '↖️',
      'fork-right': '↗️',
      'roundabout': '🔄',
    };
    
    return iconMap[maneuver] || '⬆️';
  };

  const checkIfNeedRecalculation = () => {
    if (!navigationSteps.length || !currentLocation) return;
    
    // Lógica para detectar si el usuario se desvió de la ruta
    const currentStep = navigationSteps[currentStepIndex];
    if (currentStep && currentStep.start_location) {
      const distanceFromRoute = calculateDistance(
        currentLocation,
        currentStep.start_location
      );
      
      // Si está muy lejos de la ruta (más de 100 metros), recalcular
      if (distanceFromRoute > 0.1) {
        recalculateRoute();
      }
    }
  };

  const recalculateRoute = () => {
    if (isRecalculating) return;
    
    setIsRecalculating(true);
    setCurrentInstruction('Recalculando ruta...');
    setFloodWarningShown(false); // Reset flood warning when recalculating
    
    // La recalculación se maneja automáticamente cuando MapViewDirections detecta el cambio de origen
  };

  const updateRemainingInfo = () => {
    if (!navigationSteps.length || currentStepIndex >= navigationSteps.length) return;
    
    let remainingDistance = 0;
    let remainingTime = 0;
    
    // Calcular distancia y tiempo restante
    for (let i = currentStepIndex; i < navigationSteps.length; i++) {
      const step = navigationSteps[i];
      remainingDistance += step.distance?.value || 0;
      remainingTime += step.duration?.value || 0;
    }
    
    const distanceKm = (remainingDistance / 1000).toFixed(1);
    const timeMin = Math.round(remainingTime / 60);
    const eta = new Date(Date.now() + remainingTime * 1000);
    
    setRouteInfo(prev => ({
      ...prev,
      remainingDistance: `${distanceKm} km`,
      remainingTime: `${timeMin} min`,
      eta: eta.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    }));
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (point2.lat || point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.lng || point2.longitude - point1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos((point2.lat || point2.latitude) * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const startInstructionAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(instructionAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(instructionAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de pulso para el marcador
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopNavigation = () => {
    setNavigationActive(false);
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    if (reportsUnsubscribe.current) {
      reportsUnsubscribe.current();
    }
    onNavigationCancel();
  };

  const completeNavigation = () => {
    setNavigationActive(false);
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    if (reportsUnsubscribe.current) {
      reportsUnsubscribe.current();
    }
    onNavigationComplete();
  };

  return (
    <View style={styles.container}>
      {/* Mapa con navegación */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...origin,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType={mapType}
        followsUserLocation={true}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsBuildings={true}
        showsTraffic={showTraffic}
        userLocationAnnotationTitle=""
        loadingEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {/* Marcador de destino */}
        <Marker
          coordinate={destination}
          title={destinationName}
          description="Tu destino"
        >
          <Animated.View style={[
            styles.destinationMarker,
            { transform: [{ scale: pulseAnimation }] }
          ]}>
            <Text style={styles.markerText}>🎯</Text>
          </Animated.View>
        </Marker>

        {/* Marcadores de reportes de inundación */}
        {showFloodReports && getFilteredReports().map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            }}
            title={`Inundación ${report.severityLevel}`}
            description={report.description || 'Reporte de inundación'}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[
              styles.floodMarker,
              { backgroundColor: getSeverityColor(report.severityLevel) }
            ]}>
              <Text style={styles.floodMarkerText}>
                {getSeverityEmoji(report.severityLevel)}
              </Text>
            </View>
          </Marker>
        ))}

        {/* Ruta con direcciones */}
        {currentLocation && destination && GOOGLE_MAPS_APIKEY !== 'TU_API_KEY_AQUI' && (
          <MapViewDirections
            origin={currentLocation}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="#4285F4"
            optimizeWaypoints={true}
            onReady={handleDirectionsReady}
            onError={handleDirectionsError}
            mode="DRIVING"
            language="es"
            precision="high"
            timePrecision="now"
            region="MX"
            resetOnChange={false}
          />
        )}
      </MapView>

      {/* Panel de información superior */}
      <View style={styles.topPanel}>
        <View style={styles.routeInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tiempo</Text>
            <Text style={styles.infoValue}>{routeInfo.remainingTime}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distancia</Text>
            <Text style={styles.infoValue}>{routeInfo.remainingDistance}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Llegada</Text>
            <Text style={styles.infoValue}>{routeInfo.eta}</Text>
          </View>
        </View>
        
        {speedInfo.speed > 0 && (
          <View style={styles.speedInfo}>
            <Text style={styles.speedText}>{speedInfo.speed}</Text>
            <Text style={styles.speedUnit}>km/h</Text>
          </View>
        )}

        {/* Indicador de reportes de inundación cercanos */}
        {showFloodReports && (
          <View style={styles.floodInfo}>
            <Text style={styles.floodCount}>
              💧 {getFilteredReports().length} reportes
            </Text>
          </View>
        )}
      </View>

      {/* Panel de instrucciones */}
      <View style={styles.instructionPanel}>
        <View style={styles.instructionHeader}>
          <Animated.Text style={[
            styles.maneuverIcon,
            { opacity: instructionAnimation }
          ]}>
            {getManeuverIcon(maneuverType)}
          </Animated.Text>
          <View style={styles.instructionText}>
            <Text style={styles.currentInstruction}>
              {currentInstruction}
            </Text>
            {currentStreet && (
              <Text style={styles.streetName}>
                📍 {currentStreet}
              </Text>
            )}
          </View>
        </View>
        
        {nextInstruction && (
          <View style={styles.nextInstruction}>
            <Text style={styles.nextInstructionText}>
              Después: {nextInstruction}
            </Text>
          </View>
        )}
        
        {isRecalculating && (
          <View style={styles.recalculatingBanner}>
            <Text style={styles.recalculatingText}>
              🔄 Recalculando ruta...
            </Text>
          </View>
        )}
      </View>

      {/* Controles de navegación */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            // Alternar vista del mapa
            if (mapRef.current) {
              mapRef.current.animateCamera({
                center: currentLocation,
                pitch: 0,
                heading: 0,
                altitude: 1000,
                zoom: 15,
              }, 1000);
            }
          }}
        >
          <Text style={styles.controlButtonText}>🗺️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            // Centrar en ubicación actual
            if (mapRef.current && currentLocation) {
              mapRef.current.animateCamera({
                center: currentLocation,
                pitch: 60,
                heading: userHeading,
                altitude: 500,
                zoom: 18,
              }, 1000);
            }
          }}
        >
          <Text style={styles.controlButtonText}>📍</Text>
        </TouchableOpacity>

        {/* Botón para alternar reportes de inundación */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            showFloodReports ? styles.activeButton : styles.inactiveButton
          ]}
          onPress={() => {
            // Este control se manejará desde el componente padre
            // Aquí solo mostramos un indicador visual
          }}
        >
          <Text style={styles.controlButtonText}>💧</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={stopNavigation}
        >
          <Text style={styles.controlButtonText}>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GuidedNavigation;