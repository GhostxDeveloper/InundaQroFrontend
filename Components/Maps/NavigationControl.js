import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../../styles/stylesComponentsMap/NavigationControlstyles';

const GOOGLE_MAPS_APIKEY = 'AIzaSyD6vEAeGtBjMT1zQUlFnuvJV9YORgXSFGk';

const NavigationControls = ({
  isNavigating,
  showFloodReports,
  setShowFloodReports,
  routeDistance,
  routeDuration,
  currentInstruction,
  onCenterLocation,
  onStopNavigation,
  loadingReports,
}) => {
  return (
    <>
      {/* Botón de ubicación */}
      <TouchableOpacity 
        style={[styles.locationButton, isNavigating && { bottom: 200 }]} 
        onPress={onCenterLocation}
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
            <TouchableOpacity style={styles.stopNavigationButton} onPress={onStopNavigation}>
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
    </>
  );
};

export default NavigationControls;