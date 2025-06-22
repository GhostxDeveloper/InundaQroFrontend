import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // Mapa principal
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Marcadores personalizados - MEJORADOS
  customMarker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    // Añadir un efecto de pulso
    transform: [{ scale: 1.0 }],
  },

  markerEmoji: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Callouts (globos de información) - COMPLETAMENTE REDISEÑADOS
  callout: {
    width: 280,
    minHeight: 140,
    backgroundColor: 'transparent',
    // Asegurar que sea visible
    zIndex: 1000,
    elevation: 1000,
  },

  calloutContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)', // Fondo oscuro semi-transparente
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 20,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.8)', // Borde azul semi-transparente
    // Gradiente sutil
    borderTopWidth: 4,
    borderTopColor: '#3b82f6',
  },

  calloutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff', // Texto blanco
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  calloutSeverity: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff', // Texto blanco
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.8)', // Fondo azul semi-transparente
    borderRadius: 8,
    textAlign: 'center',
    textTransform: 'capitalize',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  calloutDescription: {
    fontSize: 14,
    color: '#e5e7eb', // Texto gris claro
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'left',
    fontWeight: '500',
    backgroundColor: 'rgba(31, 41, 55, 0.8)', // Fondo gris oscuro semi-transparente
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },

  calloutDate: {
    fontSize: 13,
    color: '#d1d5db', // Texto gris más claro
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'left',
    backgroundColor: 'rgba(55, 65, 81, 0.6)', // Fondo gris medio semi-transparente
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  calloutStatus: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
    color: '#ffffff', // Texto blanco por defecto
  },

  // Estados específicos para el callout status
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.9)', // Amarillo semi-transparente
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#f59e0b',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  statusVerified: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)', // Verde semi-transparente
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#10b981',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  statusResolved: {
    backgroundColor: 'rgba(99, 102, 241, 0.9)', // Azul semi-transparente
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#6366f1',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Marcadores de destino y preview - MEJORADOS
  destinationMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },

  previewMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#f97316',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },

  // Indicadores de navegación - MEJORADOS
  navigationIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  navigationText: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Botones de control del mapa - MEJORADOS
  mapControlButton: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },

  locationButton: {
    bottom: 140,
    right: 20,
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  },

  mapTypeButton: {
    bottom: 200,
    right: 20,
    backgroundColor: '#6b7280',
    borderColor: '#4b5563',
  },

  // Indicador de carga del mapa - MEJORADO
  mapLoadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },

  // Estilos específicos para vista en primera persona - MEJORADOS
  firstPersonOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  firstPersonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },

  // Líneas de ruta - MEJORADAS
  routeLine: {
    strokeWidth: 6,
    strokeColor: '#3b82f6',
  },

  fallbackRouteLine: {
    strokeWidth: 4,
    strokeColor: '#ef4444',
  },

  // Overlay para asegurar visibilidad
  calloutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 999,
  },

  // Estilos adicionales para diferentes severidades
  severityLow: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)', // Verde semi-transparente
    borderLeftColor: '#22c55e',
    color: '#ffffff',
  },

  severityMedium: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)', // Amarillo semi-transparente
    borderLeftColor: '#f59e0b',
    color: '#ffffff',
  },

  severityHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // Rojo semi-transparente
    borderLeftColor: '#ef4444',
    color: '#ffffff',
  },

  severityCritical: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)', // Rosa semi-transparente
    borderLeftColor: '#ec4899',
    color: '#ffffff',
  },

  // Efectos de animación
  pulseEffect: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },

  // Mejoras de accesibilidad
  highContrastCallout: {
    backgroundColor: '#000000',
    borderColor: '#ffffff',
    borderWidth: 3,
  },

  highContrastText: {
    color: '#ffffff',
    fontWeight: '800',
  },
});