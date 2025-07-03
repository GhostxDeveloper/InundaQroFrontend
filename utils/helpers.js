/**
 * Obtener color según el nivel de severidad
 */
export const getSeverityColor = (level) => {
  switch (level) {
    case 'Leve': return '#10b981';
    case 'Moderado': return '#f59e0b';
    case 'Severo': return '#ef4444';
    default: return '#10b981';
  }
};

/**
 * Obtener descripción según el nivel de severidad
 */
export const getSeverityDescription = (level) => {
  switch (level) {
    case 'Leve': 
      return 'Encharcamiento menor, tránsito posible con precaución';
    case 'Moderado': 
      return 'Agua hasta las llantas, dificulta el tránsito';
    case 'Severo': 
      return 'Inundación peligrosa, evitar la zona completamente';
    default: 
      return '';
  }
};

/**
 * Formatear coordenadas para mostrar
 */
export const formatCoordinates = (coords) => {
  if (!coords) return null;
  
  return {
    latitude: parseFloat(coords.latitude).toFixed(6),
    longitude: parseFloat(coords.longitude).toFixed(6),
    accuracy: Math.round(coords.accuracy)
  };
};

/**
 * Niveles de severidad disponibles
 */
export const SEVERITY_LEVELS = ['Leve', 'Moderado', 'Severo'];

/**
 * Constantes de la aplicación
 */
export const CONSTANTS = {
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
  LOCATION_TIMEOUT: 10000,
  LOCATION_MAX_AGE: 60000,
};