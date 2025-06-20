import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import * as Location from 'expo-location';
import { styles } from '../styles/Mapstyles';
import { 
  getAllFloodReports, 
  subscribeToFloodReports, 
} from '../services/floodReportsService';

// Componentes 
import MapHeader from '../Components/Maps/MapHeader';
import MapContainer from '../Components/Maps/MapContainer';
import NavigationControls from '../Components/Maps/NavigationControl';
import SearchModal from '../Components/Maps/SearchModal';
import LocationPreviewModal from '../Components/Maps/LocationPreviewModal'; // Nuevo componente

const MapScreen = ({ navigation }) => {
  // Estados principales
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState('standard');
  const [destination, setDestination] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [currentInstruction, setCurrentInstruction] = useState('');
  
  // Estados para preview de ubicación (NUEVOS)
  const [showLocationPreview, setShowLocationPreview] = useState(false);
  const [previewLocation, setPreviewLocation] = useState(null);
  const [navigationViewType, setNavigationViewType] = useState('overview'); // 'overview' o 'firstPerson'
  
  // Estados para reportes
  const [floodReports, setFloodReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [showFloodReports, setShowFloodReports] = useState(true);
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('all');
  
  const mapRef = useRef(null);
  const reportsUnsubscribe = useRef(null);
    
  const initialRegion = {
    latitude: 20.5888,
    longitude: -100.38806,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    getCurrentLocation();
    startLocationTracking();
    loadFloodReports();
    
    return () => {
      if (reportsUnsubscribe.current) {
        reportsUnsubscribe.current();
      }
    };
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'La app necesita acceso a tu ubicación para funcionar correctamente',
          [{ text: 'Entendido' }]
        );
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newLocation);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
      setLocation(initialRegion);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const updatedLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: location?.latitudeDelta || 0.01,
            longitudeDelta: location?.longitudeDelta || 0.01,
          };
          setLocation(updatedLocation);
        }
      );
    }
  };

  const loadFloodReports = async () => {
    try {
      setLoadingReports(true);
      
      reportsUnsubscribe.current = subscribeToFloodReports((reports) => {
        setFloodReports(reports);
        setLoadingReports(false);
      });
      
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setLoadingReports(false);
      
      try {
        const reports = await getAllFloodReports();
        setFloodReports(reports);
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        Alert.alert('Error', 'No se pudieron cargar los reportes de inundación');
      }
    }
  };

  const getFilteredReports = () => {
    if (selectedSeverityFilter === 'all') {
      return floodReports;
    }
    return floodReports.filter(report => report.severityLevel === selectedSeverityFilter);
  };

  // NUEVA FUNCIÓN: Mostrar preview en lugar de navegar inmediatamente
  const showLocationPreviewModal = (location) => {
    setPreviewLocation(location);
    setShowLocationPreview(true);
    setSearchText(location.name);
    setShowSearchModal(false);
    
    // Centrar el mapa en la ubicación seleccionada
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coordinate.latitude,
        longitude: location.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // FUNCIÓN MODIFICADA: Iniciar navegación desde el preview
  const startNavigation = (destinationCoord, destinationName) => {
    if (!location) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
      return;
    }

    setDestination(destinationCoord);
    setIsNavigating(true);
    setNavigationViewType('firstPerson'); // Cambiar a vista en primera persona
    setCurrentInstruction(`Navegando hacia ${destinationName}`);
    setPreviewLocation(null); // Limpiar preview

    // Ajustar vista del mapa para navegación
    if (mapRef.current) {
      // Cambiar a vista de primera persona
      setTimeout(() => {
        mapRef.current.animateCamera({
          center: location,
          pitch: 60,
          heading: 0,
          altitude: 500,
          zoom: 18,
        }, 1000);
      }, 500);
    }
  };

  const stopNavigation = () => {
    setDestination(null);
    setIsNavigating(false);
    setNavigationViewType('overview'); // Volver a vista general
    setRouteDistance(null);
    setRouteDuration(null);
    setCurrentInstruction('');
    setSearchText('');
    
    // Volver a vista normal
    if (mapRef.current && location) {
      mapRef.current.animateCamera({
        center: location,
        pitch: 0,
        heading: 0,
        altitude: 1000,
        zoom: 15,
      }, 1000);
    }
  };

  const centerOnUserLocation = () => {
    if (location && mapRef.current) {
      if (isNavigating && navigationViewType === 'firstPerson') {
        mapRef.current.animateCamera({
          center: location,
          pitch: 60,
          heading: 0,
          altitude: 500,
          zoom: 18,
        }, 1000);
      } else {
        // Vista normal
        mapRef.current.animateToRegion({
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    }
  };

  const handleDirectionsReady = (result) => {
    setRouteDistance(result.distance.toFixed(1) + ' km');
    setRouteDuration(Math.round(result.duration) + ' min');
  };

  const handleDirectionsError = (errorMessage) => {
    console.error('Error en direcciones:', errorMessage);
    Alert.alert(
      'Error de navegación', 
      'No se pudo calcular la ruta. Verifica tu conexión a internet.',
      [
        { text: 'Reintentar', onPress: () => {
          if (destination) {
            setIsNavigating(false);
            setTimeout(() => setIsNavigating(true), 500);
          }
        }},
        { text: 'Cancelar', onPress: stopNavigation }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4285F4" barStyle="light-content" />
      
      <MapHeader
        navigation={navigation}
        searchText={searchText}
        mapType={mapType}
        setMapType={setMapType}
        setShowSearchModal={setShowSearchModal}
        floodReports={floodReports}
        selectedSeverityFilter={selectedSeverityFilter}
        setSelectedSeverityFilter={setSelectedSeverityFilter}
        loadingReports={loadingReports}
      />

      <MapContainer
        mapRef={mapRef}
        location={location}
        initialRegion={initialRegion}
        mapType={mapType}
        destination={destination}
        isNavigating={isNavigating}
        showFloodReports={showFloodReports}
        filteredReports={getFilteredReports()}
        onDirectionsReady={handleDirectionsReady}
        onDirectionsError={handleDirectionsError}
        previewLocation={previewLocation} // Nueva prop
        navigationViewType={navigationViewType} // Nueva prop
      />

      <NavigationControls
        isNavigating={isNavigating}
        showFloodReports={showFloodReports}
        setShowFloodReports={setShowFloodReports}
        routeDistance={routeDistance}
        routeDuration={routeDuration}
        currentInstruction={currentInstruction}
        onCenterLocation={centerOnUserLocation}
        onStopNavigation={stopNavigation}
        loadingReports={loadingReports}
        navigationViewType={navigationViewType} // Nueva prop
        setNavigationViewType={setNavigationViewType} // Nueva prop
      />

      <SearchModal
        visible={showSearchModal}
        searchText={searchText}
        setSearchText={setSearchText}
        onClose={() => setShowSearchModal(false)}
        onSelectDestination={showLocationPreviewModal} // CAMBIO: Ahora muestra preview
      />

      {/* NUEVO: Modal de preview de ubicación */}
      <LocationPreviewModal
        visible={showLocationPreview}
        location={previewLocation}
        userLocation={location}
        onClose={() => {
          setShowLocationPreview(false);
          setPreviewLocation(null);
        }}
        onStartNavigation={startNavigation}
      />
    </SafeAreaView>
  );
};

export default MapScreen;