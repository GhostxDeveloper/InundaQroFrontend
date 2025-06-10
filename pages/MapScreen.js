import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { styles } from '../styles/Mapstyles';
// Importar los nuevos servicios
import { 
  getAllFloodReports, 
  subscribeToFloodReports, 
  getSeverityColor,
  getSeverityEmoji,
  getReportsInRadius 
} from '../services/floodReportsService';

const MapScreen = ({ navigation }) => {
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
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Nuevos estados para reportes de inundación
  const [floodReports, setFloodReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [showFloodReports, setShowFloodReports] = useState(true);
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('all'); // all, Leve, Moderado, Severo
  
  const mapRef = useRef(null);
  const reportsUnsubscribe = useRef(null);

  // API key de Google Maps
  const GOOGLE_MAPS_APIKEY = 'AIzaSyD6vEAeGtBjMT1zQUlFnuvJV9YORgXSFGk';

  // Región inicial de Querétaro
  const initialRegion = {
    latitude: 20.5888,
    longitude: -100.38806,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Ubicaciones populares de Querétaro
  const popularLocations = [
    { name: 'Centro Histórico de Querétaro', address: 'Centro, Santiago de Querétaro, Qro.', coordinate: { latitude: 20.5888, longitude: -100.38806 } },
    { name: 'Juriquilla', address: 'Juriquilla, Santiago de Querétaro, Qro.', coordinate: { latitude: 20.6130, longitude: -100.4050 } },
    { name: 'Plaza de Armas', address: 'Plaza de Armas, Centro, Santiago de Querétaro, Qro.', coordinate: { latitude: 20.5914, longitude: -100.3915 } },
    { name: 'Antea Lifestyle Center', address: 'Av. Antea 1, Juriquilla, Qro.', coordinate: { latitude: 20.6139, longitude: -100.4067 } },
    { name: 'La Isla Shopping Village', address: 'Blvd. Juriquilla 3100, Juriquilla, Qro.', coordinate: { latitude: 20.6297, longitude: -100.4261 } },
    { name: 'Aeropuerto Internacional de Querétaro', address: 'Carretera Estatal 200, Colón, Qro.', coordinate: { latitude: 20.6173, longitude: -100.1857 } },
    { name: 'Universidad Autónoma de Querétaro', address: 'Centro Universitario, Juriquilla, Qro.', coordinate: { latitude: 20.6156, longitude: -100.4003 } },
    { name: 'Estadio Corregidora', address: 'Av. Estadio, Santiago de Querétaro, Qro.', coordinate: { latitude: 20.5369, longitude: -100.4447 } },
  ];

  useEffect(() => {
    getCurrentLocation();
    startLocationTracking();
    loadFloodReports();
    
    // Limpiar suscripción al desmontar
    return () => {
      if (reportsUnsubscribe.current) {
        reportsUnsubscribe.current();
      }
    };
  }, []);

  // Cargar reportes de inundación
  const loadFloodReports = async () => {
    try {
      setLoadingReports(true);
      
      // Suscripción en tiempo real
      reportsUnsubscribe.current = subscribeToFloodReports((reports) => {
        setFloodReports(reports);
        setLoadingReports(false);
      });
      
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setLoadingReports(false);
      
      // Fallback: cargar una vez sin suscripción
      try {
        const reports = await getAllFloodReports();
        setFloodReports(reports);
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
        Alert.alert('Error', 'No se pudieron cargar los reportes de inundación');
      }
    }
  };

  // Filtrar reportes según severidad seleccionada
  const getFilteredReports = () => {
    if (selectedSeverityFilter === 'all') {
      return floodReports;
    }
    return floodReports.filter(report => report.severityLevel === selectedSeverityFilter);
  };

  // Función para formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    let date;
    if (timestamp.toDate) {
      // Firestore Timestamp
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      // Firestore Timestamp serializado
      date = new Date(timestamp.seconds * 1000);
    } else {
      // Date normal
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const searchPlaces = async (query) => {
    if (!query.trim()) {
      setSearchResults(popularLocations);
      return;
    }

    setIsSearching(true);
    try {
      if (GOOGLE_MAPS_APIKEY === 'TU_API_KEY_AQUI') {
        const filtered = popularLocations.filter(loc => 
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.address.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=20.5888,-100.38806&radius=50000&key=${GOOGLE_MAPS_APIKEY}`
      );
      
      const data = await response.json();
      
      if (data.results) {
        const results = data.results.slice(0, 10).map(place => ({
          name: place.name,
          address: place.formatted_address,
          coordinate: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
          place_id: place.place_id,
        }));
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error buscando lugares:', error);
      const filtered = popularLocations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const openSearchModal = () => {
    setShowSearchModal(true);
    setSearchResults(popularLocations);
  };

  const selectDestination = (selectedLocation) => {
    setDestination(selectedLocation.coordinate);
    setSearchText(selectedLocation.name);
    setShowSearchModal(false);
    startNavigation(selectedLocation.coordinate, selectedLocation.name);
  };

  const startNavigation = (destinationCoord, destinationName) => {
    if (!location) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
      return;
    }

    setDestination(destinationCoord);
    setIsNavigating(true);
    setCurrentInstruction(`Navegando hacia ${destinationName}`);

    if (mapRef.current) {
      mapRef.current.fitToCoordinates(
        [location, destinationCoord],
        {
          edgePadding: { top: 100, right: 100, bottom: 300, left: 100 },
          animated: true,
        }
      );
    }
  };

  const stopNavigation = () => {
    setDestination(null);
    setIsNavigating(false);
    setRouteDistance(null);
    setRouteDuration(null);
    setCurrentInstruction('');
    setSearchText('');
  };

  const centerOnUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        ...location,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
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

  const filteredReports = getFilteredReports();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4285F4" barStyle="light-content" />
      
      {/* Barra de búsqueda */}
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.searchInput} onPress={openSearchModal}>
          <Text style={[styles.searchInputText, { color: searchText ? '#000' : '#666' }]}>
            {searchText || '¿A dónde quieres ir?'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mapTypeButton} 
          onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
        >
          <Text style={styles.mapTypeButtonText}>
            {mapType === 'standard' ? '🛰️' : '🗺️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de severidad */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterButton, selectedSeverityFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedSeverityFilter('all')}
          >
            <Text style={[styles.filterButtonText, selectedSeverityFilter === 'all' && styles.filterButtonTextActive]}>
              Todos ({floodReports.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedSeverityFilter === 'Leve' && styles.filterButtonActive]}
            onPress={() => setSelectedSeverityFilter('Leve')}
          >
            <Text style={[styles.filterButtonText, selectedSeverityFilter === 'Leve' && styles.filterButtonTextActive]}>
             🟢 Leve ({floodReports.filter(r => r.severityLevel === 'Leve').length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedSeverityFilter === 'Moderado' && styles.filterButtonActive]}
            onPress={() => setSelectedSeverityFilter('Moderado')}
          >
            <Text style={[styles.filterButtonText, selectedSeverityFilter === 'Moderado' && styles.filterButtonTextActive]}>
              🟠 Moderado ({floodReports.filter(r => r.severityLevel === 'Moderado').length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedSeverityFilter === 'Severo' && styles.filterButtonActive]}
            onPress={() => setSelectedSeverityFilter('Severo')}
          >
            <Text style={[styles.filterButtonText, selectedSeverityFilter === 'Severo' && styles.filterButtonTextActive]}>
              🔴 Severo ({floodReports.filter(r => r.severityLevel === 'Severo').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location || initialRegion}
        region={location}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={isNavigating}
        showsCompass={true}
        userLocationAnnotationTitle="Tu ubicación"
        loadingEnabled={true}
      >
        {/* Marcadores de reportes de inundación */}
        {showFloodReports && filteredReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            }}
            pinColor={getSeverityColor(report.severityLevel)}
            title={`Inundación ${report.severityLevel}`}
            description={report.description}
          >
            <View style={[styles.customMarker, { backgroundColor: getSeverityColor(report.severityLevel) }]}>
              <Text style={styles.markerEmoji}>{getSeverityEmoji(report.severityLevel)}</Text>
            </View>
            
            <Callout style={styles.callout}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>Reporte de Inundación</Text>
                <Text style={styles.calloutSeverity}>Severidad: {report.severityLevel}</Text>
                <Text style={styles.calloutDescription} numberOfLines={3}>
                  {report.description}
                </Text>
                <Text style={styles.calloutDate}>
                  {formatDate(report.createdAt)}
                </Text>
                <Text style={styles.calloutStatus}>
                  Estado: {report.status === 'pending' ? 'Pendiente' : 
                          report.status === 'verified' ? 'Verificado' : 'Resuelto'}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Marcador de destino */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destino"
            description="Tu destino seleccionado"
            pinColor="#4285F4"
          />
        )}

        {/* Direcciones con rutas reales */}
        {isNavigating && location && destination && GOOGLE_MAPS_APIKEY !== 'TU_API_KEY_AQUI' && (
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#4285F4"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={handleDirectionsReady}
            onError={handleDirectionsError}
            mode="DRIVING"
            language="es"
            precision="high"
            timePrecision="now"
            region="MX"
          />
        )}

        {/* Fallback: línea simple si no hay API key */}
        {isNavigating && location && destination && GOOGLE_MAPS_APIKEY === 'TU_API_KEY_AQUI' && (
          <Polyline
            coordinates={[location, destination]}
            strokeColor="#FF6B6B"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      {/* Botón de ubicación */}
      <TouchableOpacity 
        style={[styles.locationButton, isNavigating && { bottom: 200 }]} 
        onPress={centerOnUserLocation}
      >
        <Text style={styles.locationButtonText}>📍</Text>
      </TouchableOpacity>

      {/* Botón para toggle de reportes */}
      <TouchableOpacity 
        style={[styles.reportsToggleButton, isNavigating && { bottom: 260 }]} 
        onPress={() => setShowFloodReports(!showFloodReports)}
      >
        <Text style={styles.reportsToggleText}>
          {showFloodReports ? '🌊' : '🚫'}
        </Text>
      </TouchableOpacity>

      {/* Indicador de carga de reportes */}
      {loadingReports && (
        <View style={styles.loadingReportsIndicator}>
          <ActivityIndicator size="small" color="#4285F4" />
          <Text style={styles.loadingReportsText}>Cargando reportes...</Text>
        </View>
      )}

      {/* Panel de navegación */}
      {isNavigating && (
        <View style={styles.navigationPanel}>
          <View style={styles.navigationHeader}>
            <View style={styles.navigationInfo}>
              <Text style={styles.navigationDistance}>
                {routeDistance || 'Calculando...'}
              </Text>
              <Text style={styles.navigationDuration}>
                {routeDuration || 'Calculando tiempo...'}
              </Text>
            </View>
            <TouchableOpacity style={styles.stopNavigationButton} onPress={stopNavigation}>
              <Text style={styles.stopNavigationText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              {currentInstruction}
            </Text>
            {GOOGLE_MAPS_APIKEY === 'TU_API_KEY_AQUI' && (
              <Text style={styles.warningText}>
                ⚠️ Para rutas reales, configura tu API key de Google Maps
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Modal de búsqueda */}
      <Modal
        visible={showSearchModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSearchModal(false)}>
              <Text style={styles.modalBackButton}>←</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Buscar lugares, direcciones..."
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                searchPlaces(text);
              }}
              autoFocus={true}
              returnKeyType="search"
              onSubmitEditing={() => searchPlaces(searchText)}
            />
          </View>

          <ScrollView style={styles.locationsList}>
            {isSearching ? (
              <View style={styles.searchingContainer}>
                <ActivityIndicator size="small" color="#4285F4" />
                <Text style={styles.searchingText}>Buscando...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.locationsTitle}>
                  {searchText ? 'Resultados de búsqueda' : 'Lugares populares'}
                </Text>
                {searchResults.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.locationItem}
                    onPress={() => selectDestination(location)}
                  >
                    <View style={styles.locationIcon}>
                      <Text style={styles.locationIconText}>📍</Text>
                    </View>
                    <View style={styles.locationDetails}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationAddress}>{location.address}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {searchResults.length === 0 && searchText && (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      No se encontraron resultados para "{searchText}"
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MapScreen;