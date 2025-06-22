import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Botón de ubicación
  locationButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  locationButtonText: {
    fontSize: 20,
  },

  // Botón para toggle de reportes
  reportsToggleButton: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  reportsToggleText: {
    fontSize: 18,
  },

  // Panel principal de navegación
  navigationPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },

  // Header del panel de navegación
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  navigationInfo: {
    flex: 1,
  },

  navigationDistance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },

  navigationDuration: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },

  // Botón para detener navegación
  stopNavigationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4757',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  stopNavigationText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },

  // Contenedor de instrucciones
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 60,
    justifyContent: 'center',
  },

  instructionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },

  // Texto de advertencia
  warningText: {
    fontSize: 12,
    color: '#ff6b35',
    textAlign: 'center',
    fontStyle: 'italic',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ffcc80',
  },

  // Estados adicionales para cuando está cargando
  loadingState: {
    opacity: 0.7,
  },

  // Variaciones de color para diferentes estados
  activeReportsButton: {
    backgroundColor: '#4285F4',
  },

  activeReportsButtonText: {
    color: '#ffffff',
  },

  // Estilos para diferentes tamaños de pantalla
  compactNavigationPanel: {
    paddingBottom: 20,
  },

  expandedNavigationPanel: {
    paddingBottom: 30,
  },

  // Animaciones y transiciones
  fadeIn: {
    opacity: 1,
  },

  fadeOut: {
    opacity: 0,
  },

  // Indicadores de estado
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4caf50',
    marginRight: 8,
  },

  statusIndicatorWarning: {
    backgroundColor: '#ff9800',
  },

  statusIndicatorError: {
    backgroundColor: '#f44336',
  },

  // Texto de estado
  statusText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
  },

  // Contenedor de información adicional
  additionalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },

  additionalInfoText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '400',
  },

  // Estilos para modo oscuro (opcional)
  darkMode: {
    backgroundColor: '#2c2c2c',
    borderTopColor: '#404040',
  },

  darkModeText: {
    color: '#ffffff',
  },

  darkModeSubText: {
    color: '#cccccc',
  },
});