import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { styles } from '../../styles/stylesComponentsMap/SearchModalStyles';

const GOOGLE_MAPS_APIKEY = 'AIzaSyD6vEAeGtBjMT1zQUlFnuvJV9YORgXSFGk';

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

const SearchModal = ({
  visible,
  searchText,
  setSearchText,
  onClose,
  onSelectDestination, // Ahora solo selecciona para preview, no navega
}) => {
  const [searchResults, setSearchResults] = useState(popularLocations);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (visible) {
      setSearchResults(popularLocations);
    }
  }, [visible]);

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

  const handleTextChange = (text) => {
    setSearchText(text);
    searchPlaces(text);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalBackButton}>←</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.modalSearchInput}
            placeholder="Buscar lugares, direcciones..."
            value={searchText}
            onChangeText={handleTextChange}
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
                  onPress={() => onSelectDestination(location)}
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
  );
};

export default SearchModal;