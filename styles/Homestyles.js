import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  
  // Header con gradiente
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0369A1',
    textShadowColor: 'rgba(3, 105, 161, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  profileIcon: {
    fontSize: 18,
    color: '#0369A1',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Tarjeta de alerta principal con gradiente
  alertCard: {
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  alertDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  alertTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Tarjeta de clima con diseño similar al registro
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0369A1',
    textShadowColor: 'rgba(3, 105, 161, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
  },
  
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  retryButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  
  retryText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  weatherItem: {
    width: '47%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.1)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  weatherIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  
  weatherValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 4,
  },
  
  weatherLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Acciones rápidas con gradientes
  quickActionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  
  actionButton: {
    width: '47%',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Alertas recientes
  recentAlertsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  
  alertItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.1)',
  },
  
  alertItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  alertItemLeft: {
    flex: 1,
  },
  
  alertLevel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  
  alertZone: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
  },
  
  alertItemTime: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  
  alertItemDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 18,
  },
  
  // Consejos de seguridad
  tipsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  
  tipItem: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  
  tipText: {
    fontSize: 14,
    color: '#0369A1',
    lineHeight: 20,
  },
  
  bottomPadding: {
    height: 30,
  },
  
  // Elementos decorativos (opcional - para usar con Animated.View)
  backgroundCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1000,
  },
  
  circle1: {
    width: 120,
    height: 120,
    top: '5%',
    left: -30,
  },
  
  circle2: {
    width: 80,
    height: 80,
    top: '10%',
    right: -20,
  },
  
  circle3: {
    width: 60,
    height: 60,
    bottom: '20%',
    left: '10%',
  },
  
  drop: {
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  
  drop1: {
    width: 6,
    height: 12,
    top: '15%',
    left: width * 0.3,
    borderRadius: 6,
  },
  
  drop2: {
    width: 8,
    height: 14,
    top: '18%',
    right: width * 0.3,
    borderRadius: 7,
  },
  
  wave: {
    position: 'absolute',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  
  wave1: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -30,
  },
});