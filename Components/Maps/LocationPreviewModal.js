import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { styles } from '../../styles/Mapstyles';

const GOOGLE_MAPS_APIKEY = 'AIzaSyD6vEAeGtBjMT1zQUlFnuvJV9YORgXSFGk';
const { width: screenWidth } = Dimensions.get('window');

const LocationPreviewModal = ({
  visible,
  location,
  onClose,
  onStartNavigation,
  userLocation,
}) => {
  const [locationImages, setLocationImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (visible && location) {
      fetchLocationDetails();
    }
  }, [visible, location]);

  if (!location) return null;

  // Función para obtener detalles del lugar incluyendo fotos
  const fetchLocationDetails = async () => {
    if (!location.place_id || GOOGLE_MAPS_APIKEY === 'TU_API_KEY_AQUI') {
      // Si no hay place_id o API key, usar imagen de Street View como fallback
      generateStreetViewImage();
      return;
    }

    setLoadingImages(true);
    try {
      // Primero obtener detalles del lugar
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${location.place_id}&fields=photos,rating,opening_hours,formatted_phone_number,website,reviews&key=${GOOGLE_MAPS_APIKEY}`
      );
      
      const data = await response.json();
      
      if (data.result) {
        setLocationDetails(data.result);
        
        // Si hay fotos, obtener las URLs
        if (data.result.photos && data.result.photos.length > 0) {
          const photoUrls = data.result.photos.slice(0, 5).map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_MAPS_APIKEY}`
          );
          setLocationImages(photoUrls);
        } else {
          // Si no hay fotos del lugar, usar Street View
          generateStreetViewImage();
        }
      } else {
        generateStreetViewImage();
      }
    } catch (error) {
      console.error('Error obteniendo detalles del lugar:', error);
      generateStreetViewImage();
    } finally {
      setLoadingImages(false);
    }
  };

  // Generar imagen de Street View como fallback
  const generateStreetViewImage = () => {
    const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${location.coordinate.latitude},${location.coordinate.longitude}&heading=0&pitch=0&key=${GOOGLE_MAPS_APIKEY}`;
    
    if (GOOGLE_MAPS_APIKEY !== 'TU_API_KEY_AQUI') {
      setLocationImages([streetViewUrl]);
    } else {
      // Usar imagen placeholder si no hay API key
      setLocationImages([]);
    }
    setLoadingImages(false);
  };

  // Calcular distancia aproximada
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d.toFixed(1);
  };

  const distance = userLocation 
    ? calculateDistance(
        userLocation.latitude, 
        userLocation.longitude,
        location.coordinate.latitude,
        location.coordinate.longitude
      )
    : null;

  // Renderizar indicadores de imagen
  const renderImageIndicators = () => {
    if (locationImages.length <= 1) return null;
    
    return (
      <View style={styles.imageIndicatorsContainer}>
        {locationImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.imageIndicator,
              index === activeImageIndex && styles.imageIndicatorActive
            ]}
          />
        ))}
      </View>
    );
  };

  // Formatear horarios de apertura
  const getOpeningStatus = () => {
    if (!locationDetails?.opening_hours) return null;
    
    const isOpen = locationDetails.opening_hours.open_now;
    return (
      <View style={styles.openingStatusContainer}>
        <Text style={[
          styles.openingStatusText,
          { color: isOpen ? '#34A853' : '#EA4335' }
        ]}>
          {isOpen ? '🟢 Abierto' : '🔴 Cerrado'}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.previewModalOverlay}>
        <TouchableOpacity 
          style={styles.previewModalBackground}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <SafeAreaView style={styles.previewModalContainer}>
          {/* Header del modal */}
          <View style={styles.previewHeader}>
            <TouchableOpacity onPress={onClose} style={styles.previewCloseButton}>
              <Text style={styles.previewCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Contenedor de imágenes */}
          <View style={styles.previewImageContainer}>
            {loadingImages ? (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="large" color="#4285F4" />
                <Text style={styles.imageLoadingText}>Cargando imágenes...</Text>
              </View>
            ) : locationImages.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                    setActiveImageIndex(index);
                  }}
                  style={styles.imageScrollView}
                >
                  {locationImages.map((imageUrl, index) => (
                    <Image
                      key={index}
                      source={{ uri: imageUrl }}
                      style={styles.previewImage}
                      resizeMode="cover"
                      onError={(error) => {
                        console.error('Error cargando imagen:', error);
                      }}
                    />
                  ))}
                </ScrollView>
                {renderImageIndicators()}
              </>
            ) : (
              <View style={styles.previewImagePlaceholder}>
                <Text style={styles.previewImageIcon}>📍</Text>
                <Text style={styles.previewImagePlaceholderText}>
                  {location.name}
                </Text>
              </View>
            )}
          </View>

          {/* Información del lugar */}
          <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.previewLocationName}>{location.name}</Text>
            <Text style={styles.previewLocationAddress}>{location.address}</Text>
            
            {/* Información básica */}
            <View style={styles.previewInfoRow}>
              {locationDetails?.rating && (
                <View style={styles.previewInfoItem}>
                  <Text style={styles.previewInfoIcon}>⭐</Text>
                  <Text style={styles.previewInfoText}>{locationDetails.rating}</Text>
                </View>
              )}
              
              {getOpeningStatus()}
              
              {distance && (
                <View style={styles.previewInfoItem}>
                  <Text style={styles.previewInfoIcon}>📍</Text>
                  <Text style={styles.previewInfoText}>{distance} km</Text>
                </View>
              )}
            </View>

            {/* Información de contacto */}
            {(locationDetails?.formatted_phone_number || locationDetails?.website) && (
              <View style={styles.contactInfoContainer}>
                {locationDetails?.formatted_phone_number && (
                  <TouchableOpacity style={styles.contactItem}>
                    <Text style={styles.contactIcon}>📞</Text>
                    <Text style={styles.contactText}>{locationDetails.formatted_phone_number}</Text>
                  </TouchableOpacity>
                )}
                
                {locationDetails?.website && (
                  <TouchableOpacity style={styles.contactItem}>
                    <Text style={styles.contactIcon}>🌐</Text>
                    <Text style={styles.contactText} numberOfLines={1}>
                      {locationDetails.website.replace('https://', '').replace('http://', '')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Reseñas destacadas */}
            {locationDetails?.reviews && locationDetails.reviews.length > 0 && (
              <View style={styles.reviewsContainer}>
                <Text style={styles.reviewsTitle}>Reseñas</Text>
                {locationDetails.reviews.slice(0, 2).map((review, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Text key={i} style={styles.reviewStar}>
                            {i < review.rating ? '⭐' : '☆'}
                          </Text>
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewText} numberOfLines={3}>
                      {review.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.previewButtonsContainer}>
            <TouchableOpacity 
              style={styles.previewSecondaryButton}
              onPress={() => {
                // Aquí podrías agregar funcionalidad para llamar, guardar, etc.
                console.log('Acción secundaria');
              }}
            >
              <Text style={styles.previewSecondaryButtonText}>💾 Guardar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.previewSecondaryButton}
              onPress={() => {
                // Compartir ubicación
                console.log('Compartir ubicación');
              }}
            >
              <Text style={styles.previewSecondaryButtonText}>📤 Compartir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.previewPrimaryButton}
              onPress={() => {
                onStartNavigation(location.coordinate, location.name);
                onClose();
              }}
            >
              <Text style={styles.previewPrimaryButtonText}>🧭 Ir</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default LocationPreviewModal;