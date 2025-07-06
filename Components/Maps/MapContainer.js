import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { styles } from '../../styles/Mapstyles';
import { 
  getSeverityColor,
  getSeverityEmoji,
} from '../../services/floodReportsService';

const GOOGLE_MAPS_APIKEY = 'AIzaSyD6vEAeGtBjMT1zQUlFnuvJV9YORgXSFGk';

const MapContainer = ({
  mapRef,
  location,
  initialRegion,
  mapType,
  destination,
  isNavigating,
  showFloodReports,
  filteredReports,
  onDirectionsReady,
  onDirectionsError,
  previewLocation, // Nueva prop para mostrar ubicación en preview
  navigationViewType = 'overview', // 'overview' o 'firstPerson'
}) => {
  
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

  // Determinar configuración del mapa según el tipo de vista
  const getMapConfiguration = () => {
    if (isNavigating && navigationViewType === 'firstPerson') {
      return {
        followsUserLocation: true,
        showsUserLocation: true,
        userLocationAnnotationTitle: "",
        showsMyLocationButton: false,
        showsCompass: true,
        showsBuildings: true,
        showsTraffic: true,
        camera: location ? {
          center: location,
          pitch: 60, // Ángulo inclinado para vista en primera persona
          heading: 0, // Se ajustará automáticamente según la dirección
          altitude: 500,
          zoom: 18,
        } : undefined,
      };
    } else {
      return {
        followsUserLocation: false,
        showsUserLocation: true,
        showsMyLocationButton: false,
        showsCompass: true,
        showsBuildings: false,
        showsTraffic: false,
        userLocationAnnotationTitle: "Tu ubicación",
      };
    }
  };

  const mapConfig = getMapConfiguration();

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={location || initialRegion}
      region={!isNavigating || navigationViewType === 'overview' ? location : undefined}
      camera={mapConfig.camera}
      mapType={mapType}
      followsUserLocation={mapConfig.followsUserLocation}
      showsUserLocation={mapConfig.showsUserLocation}
      showsMyLocationButton={mapConfig.showsMyLocationButton}
      showsCompass={mapConfig.showsCompass}
      showsBuildings={mapConfig.showsBuildings}
      showsTraffic={mapConfig.showsTraffic}
      userLocationAnnotationTitle={mapConfig.userLocationAnnotationTitle}
      loadingEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}
      scrollEnabled={navigationViewType !== 'firstPerson'}
      zoomEnabled={navigationViewType !== 'firstPerson'}
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

      {/* Marcador de ubicación en preview */}
      {previewLocation && (
        <Marker
          coordinate={previewLocation.coordinate}
          title={previewLocation.name}
          description={previewLocation.address}
          pinColor="#FF6B35"
        />
      )}

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
          strokeWidth={navigationViewType === 'firstPerson' ? 8 : 5}
          strokeColor="#4285F4"
          optimizeWaypoints={true}
          onStart={(params) => {
            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
          }}
          onReady={onDirectionsReady}
          onError={onDirectionsError}
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
  );
};

export default MapContainer;