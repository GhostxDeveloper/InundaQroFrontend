import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Loading Screen (cuando se obtiene la ubicación)
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Gradiente moderno
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Overlay para efectos de transición
  screenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  // Contenedor del mapa
  mapWrapper: {
    flex: 1,
    position: 'relative',
    borderRadius: Platform.OS === 'ios' ? 20 : 0,
    overflow: 'hidden',
    margin: Platform.OS === 'ios' ? 8 : 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },

  // Indicador de navegación activa
  navigationActiveIndicator: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    elevation: 6,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navigationActiveText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },

  // Indicador de carga de reportes
  reportsLoadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    zIndex: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  reportsLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // Toast para mensajes temporales
  toastContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 300,
    elevation: 10,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  toastSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.95)',
  },
  toastError: {
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
  },
  toastWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.95)',
  },

  // Efectos visuales para transiciones
  fadeTransition: {
    opacity: 0,
  },
  slideFromBottom: {
    transform: [{ translateY: height }],
  },
  slideFromTop: {
    transform: [{ translateY: -height }],
  },
  scaleIn: {
    transform: [{ scale: 0.8 }],
    opacity: 0,
  },

  // Estados específicos para diferentes modos
  navigationMode: {
    backgroundColor: '#0f172a',
  },
  previewMode: {
    backgroundColor: '#1e293b',
  },
  standardMode: {
    backgroundColor: '#f8fafc',
  },

  // Indicadores de conectividad
  offlineIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 400,
  },
  offlineText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Overlay para modo noche/día
  dayModeOverlay: {
    backgroundColor: 'transparent',
  },
  nightModeOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  // Animaciones y efectos
  pulseAnimation: {
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 12,
  },
  
  glowEffect: {
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },

  // Responsive adjustments
  tablet: {
    marginHorizontal: 20,
    borderRadius: 24,
  },
  
  // Accessibility improvements
  highContrast: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  
  reducedMotion: {
    // Estilos para usuarios que prefieren movimiento reducido
    transform: [],
    opacity: 1,
  },

  // Performance optimizations
  hardwareAccelerated: {
    renderToHardwareTextureAndroid: true,
    shouldRasterizeIOS: true,
    rasterizationScale: 2,
  },
});