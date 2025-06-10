    // services/floodReportsService.js
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Ajusta la ruta según tu configuración

// Obtener todos los reportes de inundación
export const getAllFloodReports = async () => {
  try {
    const reportsQuery = query(
      collection(db, 'floodReports'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(reportsQuery);
    const reports = [];

    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return reports;
  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    throw error;
  }
};

// Obtener reportes por nivel de severidad
export const getReportsBySeverity = async (severityLevel) => {
  try {
    const reportsQuery = query(
      collection(db, 'floodReports'),
      where('severityLevel', '==', severityLevel),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(reportsQuery);
    const reports = [];

    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return reports;
  } catch (error) {
    console.error('Error obteniendo reportes por severidad:', error);
    throw error;
  }
};

// Obtener reportes en un radio específico (en km)
export const getReportsInRadius = async (centerLat, centerLng, radiusKm = 10) => {
  try {
    // Para una búsqueda más precisa, idealmente usarías GeoFirestore
    // Por ahora, obtenemos todos y filtramos localmente
    const allReports = await getAllFloodReports();
    
    const reportsInRadius = allReports.filter(report => {
      const distance = calculateDistance(
        centerLat, 
        centerLng, 
        report.location.latitude, 
        report.location.longitude
      );
      return distance <= radiusKm;
    });

    return reportsInRadius;
  } catch (error) {
    console.error('Error obteniendo reportes en radio:', error);
    throw error;
  }
};

// Suscripción en tiempo real a los reportes
export const subscribeToFloodReports = (callback) => {
  const reportsQuery = query(
    collection(db, 'floodReports'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(reportsQuery, (querySnapshot) => {
    const reports = [];
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(reports);
  }, (error) => {
    console.error('Error en suscripción a reportes:', error);
  });
};

// Función auxiliar para calcular distancia entre dos puntos
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Función para obtener el color del marcador según severidad
export const getSeverityColor = (severityLevel) => {
  switch (severityLevel) {
    case 'Leve':
      return '#FFA500'; // Naranja
    case 'Moderado':
      return '#FF6B00'; // Naranja oscuro
    case 'Severo':
      return '#FF0000'; // Rojo
    default:
      return '#808080'; // Gris por defecto
  }
};

// Función para obtener el emoji del marcador según severidad
export const getSeverityEmoji = (severityLevel) => {
  switch (severityLevel) {
    case 'Leve':
      return '🟢'; // Círculo verde 
    case 'Moderado':
      return '🟠'; // Círculo naranja
    case 'Severo':
      return '🔴'; // Círculo rojo
    default:
      return '⚪'; // Círculo blanco por defecto
  }
};