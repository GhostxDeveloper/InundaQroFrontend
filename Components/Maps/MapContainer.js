import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { styles } from '../../styles/MapContainerStyles';
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
  previewLocation,
  navigationViewType = 'overview',
}) => {
  
  // Estado para controlar el modal del reporte seleccionado
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Función para formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para manejar la selección de un reporte
  const handleMarkerPress = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  // Función para obtener estilos de status
  const getStatusStyle = (status) => {
    const baseStyle = [styles.calloutStatus];
    switch (status) {
      case 'pending':
        return [...baseStyle, styles.statusPending];
      case 'verified':
        return [...baseStyle, styles.statusVerified];
      case 'resolved':
        return [...baseStyle, styles.statusResolved];
      default:
        return baseStyle;
    }
  };

  // Función para obtener estilos de severidad
  const getSeverityStyle = (severity) => {
    const baseStyle = [styles.calloutDescription];
    switch (severity?.toLowerCase()) {
      case 'low':
      case 'baja':
        return [...baseStyle, styles.severityLow];
      case 'medium':
      case 'media':
        return [...baseStyle, styles.severityMedium];
      case 'high':
      case 'alta':
        return [...baseStyle, styles.severityHigh];
      case 'critical':
      case 'crítica':
        return [...baseStyle, styles.severityCritical];
      default:
        return baseStyle;
    }
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
          pitch: 60,
          heading: 0,
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
    <>
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
        {/* Marcadores de reportes de inundación - SIN CALLOUT */}
        {showFloodReports && filteredReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            }}
            onPress={() => handleMarkerPress(report)}
          >
            <View style={[
              styles.customMarker, 
              { backgroundColor: getSeverityColor(report.severityLevel) }
            ]}>
              <Text style={styles.markerEmoji}>
                {getSeverityEmoji(report.severityLevel)}
              </Text>
            </View>
          </Marker>
        ))}

        {/* Marcador de ubicación en preview */}
        {previewLocation && (
          <Marker
            coordinate={previewLocation.coordinate}
            title={previewLocation.name}
            description={previewLocation.address}
          >
            <View style={styles.previewMarker}>
              <Text style={styles.markerEmoji}>📍</Text>
            </View>
          </Marker>
        )}

        {/* Marcador de destino */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destino"
            description="Tu destino seleccionado"
          >
            <View style={styles.destinationMarker}>
              <Text style={styles.markerEmoji}>🎯</Text>
            </View>
          </Marker>
        )}

        {/* Direcciones con rutas reales */}
        {isNavigating && location && destination && GOOGLE_MAPS_APIKEY !== 'TU_API_KEY_AQUI' && (
          <MapViewDirections
            origin={location}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={navigationViewType === 'firstPerson' ? 8 : styles.routeLine.strokeWidth}
            strokeColor={styles.routeLine.strokeColor}
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

        {/* Fallback: línea simple */}
        {isNavigating && location && destination && GOOGLE_MAPS_APIKEY === 'TU_API_KEY_AQUI' && (
          <Polyline
            coordinates={[location, destination]}
            strokeColor={styles.fallbackRouteLine.strokeColor}
            strokeWidth={styles.fallbackRouteLine.strokeWidth}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      {/* Modal personalizado para mostrar información del reporte */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            {selectedReport && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header del modal */}
                <View style={modalStyles.modalHeader}>
                  <Text style={styles.calloutTitle}>
                    🌊 Reporte de Inundación
                  </Text>
                  <TouchableOpacity 
                    style={modalStyles.closeButton}
                    onPress={closeModal}
                  >
                    <Text style={modalStyles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Contenido del modal */}
                <View style={modalStyles.modalContent}>
                  <Text style={styles.calloutSeverity}>
                    Severidad: {selectedReport.severityLevel}
                  </Text>
                  
                  <View style={modalStyles.descriptionContainer}>
                    <Text style={modalStyles.descriptionLabel}>Descripción:</Text>
                    <Text style={getSeverityStyle(selectedReport.severityLevel)}>
                      {selectedReport.description}
                    </Text>
                  </View>
                  
                  <Text style={styles.calloutDate}>
                    📅 {formatDate(selectedReport.createdAt)}
                  </Text>
                  
                  <Text style={getStatusStyle(selectedReport.status)}>
                    Estado: {selectedReport.status === 'pending' ? 'Pendiente' : 
                            selectedReport.status === 'verified' ? 'Verificado' : 'Resuelto'}
                  </Text>

                  {/* Información adicional si existe */}
                  {selectedReport.reportedBy && (
                    <Text style={modalStyles.additionalInfo}>
                      👤 Reportado por: {selectedReport.reportedBy}
                    </Text>
                  )}

                  {selectedReport.waterLevel && (
                    <Text style={modalStyles.additionalInfo}>
                      📏 Nivel de agua: {selectedReport.waterLevel}
                    </Text>
                  )}
                </View>

                {/* Botón de cerrar */}
                <TouchableOpacity 
                  style={modalStyles.closeModalButton}
                  onPress={closeModal}
                >
                  <Text style={modalStyles.closeModalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

// Estilos específicos para el modal
const modalStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopWidth: 3,
    borderTopColor: '#3b82f6',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    gap: 15,
  },
  descriptionContainer: {
    marginVertical: 10,
  },
  descriptionLabel: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  additionalInfo: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 8,
  },
  closeModalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
};

export default MapContainer;