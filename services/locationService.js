import * as Location from 'expo-location';
import { Alert } from 'react-native';

/**
 * Solicitar permisos de ubicación y obtener coordenadas actuales
 */
export const requestLocationPermission = async () => {
  try {
    // Solicitar permisos de ubicación
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Necesitamos acceso a tu ubicación para reportar la inundación correctamente.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Configuración', onPress: () => Location.requestForegroundPermissionsAsync() }
        ]
      );
      throw new Error('Permisos de ubicación denegados');
    }

    // Obtener ubicación actual
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 10000,
      maximumAge: 60000,
    });

    return {
      success: true,
      location: currentLocation,
      error: null
    };
    
  } catch (error) {
    console.error('Error obteniendo ubicación:', error);
    
    return {
      success: false,
      location: null,
      error: error.message || 'Error al obtener ubicación'
    };
  }
};