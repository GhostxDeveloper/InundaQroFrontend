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
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

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
  const mapRef = useRef(null);

  // API key de Google Maps - IMPORTANTE: Reemplaza con tu API key real
  const GOOGLE_MAPS_APIKEY = 'AIzaSyD6vEAeGtBjMT1zQUlFnuvJV9YORgXSFGk'; // Cambia esto por tu API key

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
      // Usar ubicación por defecto si falla
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

  // Buscar lugares usando Google Places API
  const searchPlaces = async (query) => {
    if (!query.trim()) {
      setSearchResults(popularLocations);
      return;
    }

    setIsSearching(true);
    try {
      // Si no tienes API key, usar ubicaciones predefinidas
      if (GOOGLE_MAPS_APIKEY === 'TU_API_KEY_AQUI') {
        const filtered = popularLocations.filter(loc => 
          loc.name.toLowerCase().includes(query.toLowerCase()) ||
          loc.address.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
        setIsSearching(false);
        return;
      }

      // Buscar cerca de Querétaro
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
      // Fallback a búsqueda local
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

    // Ajustar el mapa para mostrar toda la ruta
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
          // Reintentamos la navegación
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#4285F4',
    fontWeight: '500',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInputText: {
    fontSize: 16,
  },
  mapTypeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  mapTypeButtonText: {
    fontSize: 20,
  },
  map: {
    flex: 1,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  locationButtonText: {
    fontSize: 20,
  },
  navigationPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 20,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navigationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationDistance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 10,
  },
  navigationDuration: {
    fontSize: 16,
    color: '#666',
  },
  stopNavigationButton: {
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopNavigationText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    lineHeight: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 2,
  },
  modalBackButton: {
    fontSize: 24,
    color: '#4285F4',
    marginRight: 15,
    fontWeight: '500',
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
  locationsList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  searchingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  locationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  locationIcon: {
    marginRight: 15,
    width: 30,
    alignItems: 'center',
  },
  locationIconText: {
    fontSize: 20,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
    lineHeight: 20,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MapScreen;