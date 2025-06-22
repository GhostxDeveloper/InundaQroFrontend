import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  map: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  // Panel superior con información de ruta
  topPanel: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  routeInfo: {
    flexDirection: 'row',
    flex: 1,
  },

  infoItem: {
    flex: 1,
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },

  speedInfo: {
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
  },

  speedText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },

  speedUnit: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
  },

  // Panel de instrucciones
  instructionPanel: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  maneuverIcon: {
    fontSize: 32,
    marginRight: 15,
    width: 40,
    textAlign: 'center',
  },

  instructionText: {
    flex: 1,
  },

  currentInstruction: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    lineHeight: 24,
  },

  streetName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },

  nextInstruction: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  nextInstructionText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },

  recalculatingBanner: {
    marginTop: 10,
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },

  recalculatingText: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Controles inferiores
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
  },

  stopButton: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
  },

  controlButtonText: {
    fontSize: 24,
  },

  // Marcadores personalizados
  destinationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
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
  },

  markerText: {
    fontSize: 20,
  },

  // Estados de carga
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },

  // Responsive design
  '@media (max-width: 350)': {
    instructionPanel: {
      left: 10,
      right: 10,
      padding: 15,
    },
    
    topPanel: {
      left: 10,
      right: 10,
      padding: 12,
    },
    
    currentInstruction: {
      fontSize: 16,
    },
    
    infoValue: {
      fontSize: 14,
    },
  },

  // Modo nocturno (opcional)
  nightMode: {
    backgroundColor: '#1a1a1a',
  },

  nightModePanel: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
  },

  nightModeText: {
    color: '#fff',
  },

  nightModeLabel: {
    color: '#ccc',
  },

  floodMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floodMarkerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  
  // Información de reportes de inundación
  floodInfo: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  floodCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Botones activos/inactivos
  activeButton: {
    backgroundColor: '#4285F4',
  },
  inactiveButton: {
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
  },
  
  // Banner de alerta de inundación
  floodAlert: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: '#FF6B00',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floodAlertText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
});
