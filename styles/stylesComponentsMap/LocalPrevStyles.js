import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const locationPreviewStyles = StyleSheet.create({
  // Modal Container
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  
  previewModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  previewModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 25,
  },

  // Header
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  
  previewCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  
  previewCloseText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },

  // Image Container
  previewImageContainer: {
    height: 120,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  
  imageLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(66, 133, 244, 0.08)',
  },
  
  imageLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
  },
  
  imageScrollView: {
    flex: 1,
  },
  
  previewImage: {
    width: screenWidth - 40,
    height: 120,
    backgroundColor: '#F0F0F0',
  },
  
  previewImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  previewImageIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  
  previewImagePlaceholderText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  
  // Image Indicators
  imageIndicatorsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
    backdropFilter: 'blur(10px)',
  },
  
  imageIndicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  // Content
  previewContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  previewLocationName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
    lineHeight: 34,
  },
  
  previewLocationAddress: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '400',
  },

  // Info Row
  previewInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  
  previewInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  
  previewInfoIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  
  previewInfoText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },
  
  // Opening Status
  openingStatusContainer: {
    backgroundColor: 'rgba(52, 168, 83, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 168, 83, 0.2)',
  },
  
  openingStatusText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Contact Info
  contactInfoContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  
  contactText: {
    flex: 1,
    fontSize: 15,
    color: '#1A73E8',
    fontWeight: '500',
  },

  // Reviews
  reviewsContainer: {
    marginBottom: 24,
  },
  
  reviewsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  
  reviewItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  reviewStar: {
    fontSize: 12,
    marginLeft: 1,
  },
  
  reviewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontWeight: '400',
  },

  // Action Buttons
  previewButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  
  previewSecondaryButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(66, 133, 244, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
  previewSecondaryButtonText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '600',
  },
  
  previewPrimaryButton: {
    flex: 1.2,
    backgroundColor: '#1A73E8',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  previewPrimaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

// Estilos adicionales para efectos especiales
export const animatedStyles = StyleSheet.create({
  // Efectos de hover/press para botones
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },
  
  // Efectos de gradiente (para usar con react-native-linear-gradient)
  gradientButton: {
    borderRadius: 16,
    padding: 2,
  },
  
  gradientButtonInner: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Efectos de blur para iOS
  blurEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Animaciones de entrada
  slideUpAnimation: {
    transform: [
      {
        translateY: screenHeight,
      },
    ],
  },
  
  fadeInAnimation: {
    opacity: 0,
  },
  
  // Efectos de glassmorphism
  glassmorphCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // Efectos para modo oscuro
  darkModeOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  
  darkModeContainer: {
    backgroundColor: '#1E1E1E',
  },
  
  darkModeText: {
    color: '#FFFFFF',
  },
  
  darkModeSubtext: {
    color: '#B0B0B0',
  },
  
  darkModeCard: {
    backgroundColor: '#2D2D2D',
    borderColor: '#404040',
  },
  
  darkModeButton: {
    backgroundColor: '#4A90E2',
  },
  
  darkModeSecondaryButton: {
    backgroundColor: '#404040',
    borderColor: '#606060',
  },
});

// Constantes para animaciones
export const ANIMATION_DURATION = 300;
export const SPRING_CONFIG = {
  tension: 100,
  friction: 8,
  useNativeDriver: true,
};

// Colores del tema
export const THEME_COLORS = {
  primary: '#1A73E8',
  secondary: '#34A853',
  accent: '#FBBC04',
  danger: '#EA4335',
  surface: '#FFFFFF',
  background: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E8EAED',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Utilidades para responsive design
export const RESPONSIVE = {
  isSmallScreen: screenWidth < 375,
  isMediumScreen: screenWidth >= 375 && screenWidth < 414,
  isLargeScreen: screenWidth >= 414,
  screenWidth,
  screenHeight,
};