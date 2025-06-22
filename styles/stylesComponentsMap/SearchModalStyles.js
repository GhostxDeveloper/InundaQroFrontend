import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Contenedor principal del modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Header del modal con búsqueda
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },

  // Botón de regreso
  modalBackButton: {
    fontSize: 24,
    color: '#333333',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    minWidth: 40,
    minHeight: 40,
    lineHeight: 32,
  },

  // Campo de búsqueda principal
  modalSearchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333333',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Lista de ubicaciones
  locationsList: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingTop: 8,
  },

  // Título de secciones
  locationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    letterSpacing: 0.5,
  },

  // Elemento individual de ubicación
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    marginBottom: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Icono de ubicación
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#bbdefb',
  },

  locationIconText: {
    fontSize: 18,
  },

  // Detalles de la ubicación
  locationDetails: {
    flex: 1,
    paddingRight: 8,
  },

  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 22,
  },

  locationAddress: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontWeight: '400',
  },

  // Contenedor de búsqueda en progreso
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },

  searchingText: {
    fontSize: 16,
    color: '#4285F4',
    marginLeft: 12,
    fontWeight: '500',
  },

  // Contenedor sin resultados
  noResultsContainer: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },

  noResultsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },

  // Estados de interacción
  locationItemPressed: {
    backgroundColor: '#f0f8ff',
    transform: [{ scale: 0.98 }],
  },

  modalSearchInputFocused: {
    borderColor: '#4285F4',
    backgroundColor: '#ffffff',
    shadowColor: '#4285F4',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // Elementos destacados
  featuredLocationItem: {
    backgroundColor: '#f8f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },

  featuredLocationIcon: {
    backgroundColor: '#4285F4',
    borderColor: '#1976D2',
  },

  featuredLocationIconText: {
    color: '#ffffff',
  },

  // Separadores y divisores
  sectionDivider: {
    height: 8,
    backgroundColor: '#f5f5f5',
  },

  // Sugerencias rápidas (opcional)
  quickSuggestions: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  quickSuggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  quickSuggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  quickSuggestionChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },

  quickSuggestionText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },

  // Botón de limpiar búsqueda
  clearSearchButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    bottom: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  clearSearchText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },

  // Categorías de lugares
  categoryHeader: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  categoryHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Indicadores de distancia (opcional)
  distanceIndicator: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },

  distanceText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },

  // Efectos de hover/press
  locationItemHover: {
    backgroundColor: '#f8f9fa',
  },

  // Modo oscuro (preparado para implementación futura)
  darkModeContainer: {
    backgroundColor: '#121212',
  },

  darkModeHeader: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333333',
  },

  darkModeText: {
    color: '#ffffff',
  },

  darkModeSubText: {
    color: '#cccccc',
  },

  darkModeInput: {
    backgroundColor: '#2c2c2c',
    color: '#ffffff',
  },

  // Animaciones y transiciones
  fadeIn: {
    opacity: 1,
  },

  fadeOut: {
    opacity: 0,
  },

  // Espaciado adicional para diferentes tamaños de pantalla
  ...Platform.select({
    ios: {
      modalHeaderIOS: {
        paddingTop: 8,
      },
    },
    android: {
      modalHeaderAndroid: {
        paddingTop: 4,
      },
    },
  }),

  // Mejoras visuales adicionales
  shimmerEffect: {
    backgroundColor: '#f0f0f0',
  },

  pulseAnimation: {
    opacity: 0.7,
  },

  // Accesibilidad
  accessibilityLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});

// Variantes de colores para diferentes tipos de ubicaciones
export const locationTypeColors = {
  restaurant: '#FF5722',
  shopping: '#9C27B0',
  hospital: '#F44336',
  school: '#2196F3',
  park: '#4CAF50',
  transport: '#FF9800',
  default: '#4285F4',
};