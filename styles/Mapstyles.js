import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Paleta de colores para la aplicación de inundaciones
const colors = {
  // Azules principales (agua)
  primary: '#1E88E5',      // Azul agua principal
  primaryDark: '#1565C0',  // Azul agua oscuro
  primaryLight: '#42A5F5', // Azul agua claro
  
  // Celestes y aguamarina
  secondary: '#26C6DA',    // Celeste vibrante
  secondaryLight: '#4DD0E1', // Celeste claro
  
  // Grises (neutrales)
  background: '#F5F7FA',   // Gris muy claro
  surface: '#FFFFFF',      // Blanco
  surfaceVariant: '#E3F2FD', // Azul muy claro
  
  // Texto
  onSurface: '#263238',    // Gris oscuro azulado
  onSurfaceVariant: '#546E7A', // Gris medio azulado
  onSurfaceLight: '#78909C', // Gris claro azulado
  
  // Estados de severidad
  severityLow: '#4CAF50',    // Verde para bajo riesgo
  severityMedium: '#FF9800', // Naranja para riesgo medio
  severityHigh: '#F44336',   // Rojo para alto riesgo
  severityCritical: '#9C27B0', // Morado para crítico
  
  // Bordes y divisores
  border: '#B0BEC5',       // Gris azulado claro
  divider: '#CFD8DC',      // Gris azulado muy claro
  
  // Overlay y sombras
  overlay: 'rgba(30, 136, 229, 0.1)', // Azul con transparencia
  shadow: 'rgba(38, 50, 56, 0.15)',   // Sombra azul grisácea
};

export const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Pantalla de carga
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },

  // Barra de búsqueda superior
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    marginTop: 21,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInputText: {
    fontSize: 16,
    color: colors.onSurface,
  },
  mapTypeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  mapTypeButtonText: {
    fontSize: 18,
    color: colors.surface,
  },

  // Filtros de severidad
  filterContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.surface,
    fontWeight: '600',
  },

  // Mapa
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Marcadores personalizados
  customMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Callouts (ventanas emergentes de marcadores)
  callout: {
    width: 250,
    padding: 0,
  },
  calloutContainer: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    minWidth: 200,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.onSurface,
    marginBottom: 4,
  },
  calloutSeverity: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  calloutDescription: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: 6,
  },
  calloutDate: {
    fontSize: 12,
    color: colors.onSurfaceLight,
    marginBottom: 4,
  },
  calloutStatus: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500',
  },

  // Botones flotantes
  locationButton: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  locationButtonText: {
    fontSize: 20,
    color: colors.primary,
  },

  reportsToggleButton: {
    position: 'absolute',
    bottom: 180,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  reportsToggleText: {
    fontSize: 20,
    color: colors.secondary,
  },

  // Indicador de carga de reportes
  loadingReportsIndicator: {
    position: 'absolute',
    top: 120,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  loadingReportsText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginLeft: 6,
  },

  // Panel de navegación
  navigationPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  navigationInfo: {
    flex: 1,
  },
  navigationDistance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.onSurface,
  },
  navigationDuration: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  stopNavigationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.severityHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopNavigationText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  instructionText: {
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '500',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 12,
    color: colors.severityMedium,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Modal de búsqueda
  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  modalBackButton: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 16,
  },
  modalSearchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.onSurface,
  },

  // Lista de ubicaciones
  locationsList: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  locationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.onSurface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.surfaceVariant,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationIconText: {
    fontSize: 16,
    color: colors.primary,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },

  // Estados de búsqueda
  searchingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  searchingText: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginLeft: 8,
  },
  noResultsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Utilidades
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Responsive adjustments for tablets
  '@media (min-width: 768)': {
    searchBar: {
      paddingHorizontal: 24,
    },
    filterContainer: {
      paddingHorizontal: 24,
    },
    navigationPanel: {
      marginHorizontal: 20,
      borderRadius: 20,
      bottom: 20,
    },
  },

  // Estilos adicionales específicos para niveles de severidad
  severityLow: {
    backgroundColor: colors.severityLow,
  },
  severityMedium: {
    backgroundColor: colors.severityMedium,
  },
  severityHigh: {
    backgroundColor: colors.severityHigh,
  },
  severityCritical: {
    backgroundColor: colors.severityCritical,
  },
});