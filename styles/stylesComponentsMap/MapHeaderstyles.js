import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const mapHeaderStyles = StyleSheet.create({
  // Barra de búsqueda principal
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginTop: 30, // Posiciona la barra más abajo
    marginHorizontal: 16,
    backgroundColor: 'rgba(173, 216, 230, 0.9)', // Azul suave con transparencia
    borderRadius: 18,
    elevation: 8,
    shadowColor: '#4682B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(135, 206, 235, 0.5)', // Borde azul claro
  },

  // Botón de regreso
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(70, 130, 180, 0.8)', // Azul steel más intenso
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 4,
    shadowColor: '#2F4F4F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  // Texto del botón de regreso
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Input de búsqueda
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(240, 248, 255, 0.95)', // Azul muy claro (alice blue)
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(176, 224, 230, 0.8)', // Borde powder blue
    elevation: 2,
    shadowColor: '#4682B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  // Texto del input de búsqueda
  searchInputText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2F4F4F', // Dark slate gray para mejor contraste
  },

  // Estilos adicionales para el tema de inundaciones
  waterEffect: {
    // Efecto de ondas de agua (opcional para animaciones)
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
    borderRadius: 25,
    overflow: 'hidden',
  },

  // Variante con gradiente azul (si usas LinearGradient)
  searchBarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 60,
    marginHorizontal: 16,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#4682B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Para usar con LinearGradient: colors={['#B0E0E6', '#87CEEB', '#87CEFA']}
  },

  // Estilo para estado activo/presionado
  searchInputActive: {
    borderColor: 'rgba(70, 130, 180, 0.8)',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    elevation: 4,
  },

  // Placeholder personalizado para el tema
  placeholderStyle: {
    color: 'rgba(70, 130, 180, 0.7)',
    fontStyle: 'italic',
  },


  // Botón de tipo de mapa
  mapTypeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTypeButtonText: {
    fontSize: 18,
  },

  // Contenedor de filtros
  filterContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },

  // Botones de filtro
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    borderWidth: 1,
    borderColor: '#4285F4',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filterButtonActive: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
    elevation: 2,
    shadowColor: '#4285F4',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  filterButtonText: {
    fontSize: 13,
    color: '#4285F4',
    fontWeight: '600',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },

  // Indicador de carga de reportes
  loadingReportsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(66, 133, 244, 0.2)',
  },
  loadingReportsText: {
    fontSize: 12,
    color: '#4285F4',
    marginLeft: 8,
    fontWeight: '500',
  },

  // Variantes de filtros por severidad
  filterButtonLeve: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
  },
  filterButtonLeve_Active: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterButtonLeve_Text: {
    color: '#4CAF50',
  },
  filterButtonLeve_TextActive: {
    color: '#ffffff',
  },

  filterButtonModerado: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: '#FF9800',
  },
  filterButtonModerado_Active: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  filterButtonModerado_Text: {
    color: '#FF9800',
  },
  filterButtonModerado_TextActive: {
    color: '#ffffff',
  },

  filterButtonSevero: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: '#F44336',
  },
  filterButtonSevero_Active: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  filterButtonSevero_Text: {
    color: '#F44336',
  },
  filterButtonSevero_TextActive: {
    color: '#ffffff',
  },

  // Estados de hover/press (para mejor UX)
  searchInputPressed: {
    backgroundColor: '#f8f9fb',
    transform: [{ scale: 0.98 }],
  },
  backButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 0.95 }],
  },
  mapTypeButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 0.95 }],
  },
  filterButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },

  // Adaptaciones para diferentes tamaños de pantalla
  searchBarCompact: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchInputCompact: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  backButtonCompact: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  mapTypeButtonCompact: {
    width: 36,
    height: 36,
  },

  // Variante con borde redondeado para la barra de búsqueda
  searchBarRounded: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  // Estado de modo nocturno
  searchBarDark: {
    backgroundColor: '#1a1a1a',
  },
  searchInputDark: {
    backgroundColor: '#2d2d2d',
  },
  searchInputTextDark: {
    color: '#ffffff',
  },
  filterContainerDark: {
    backgroundColor: 'rgba(45, 45, 45, 0.98)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingReportsIndicatorDark: {
    backgroundColor: 'rgba(66, 133, 244, 0.2)',
    borderBottomColor: 'rgba(66, 133, 244, 0.3)',
  },

  // Indicadores de conteo
  countBadge: {
    minWidth: 20,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  countBadgeTextActive: {
    color: '#4285F4',
  },

  // Animaciones y transiciones
  filterButtonAnimated: {
    transform: [{ scale: 1 }],
  },
  filterButtonAnimatedActive: {
    transform: [{ scale: 1.05 }],
  },

  // Utilidades específicas para el header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginHorizontal: 16,
  },

  // Responsivo para tablets
  searchBarTablet: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchInputTablet: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 16,
  },
  filterContainerTablet: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  filterButtonTablet: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 6,
  },

  // Estados de error
  searchBarError: {
    borderBottomWidth: 2,
    borderBottomColor: '#F44336',
  },
  searchInputError: {
    borderWidth: 1,
    borderColor: '#F44336',
  },

  // Accesibilidad
  accessibilityButton: {
    minWidth: 44,
    minHeight: 44,
  },
});