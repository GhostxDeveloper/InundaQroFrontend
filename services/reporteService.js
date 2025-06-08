// services/reporteService.js
import { storage, db } from '../firebase/firebaseConfig'; // Asegúrate de que esta ruta sea correcta
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadImageWithDiagnostics, diagnoseFirebase, testStorageConnection } from './firebaseService';

/**
 * Sube una imagen a Firebase Storage
 * @param {Object} imageAsset - Asset de imagen de expo-image-picker
 * @param {string} reportId - ID único del reporte
 * @returns {Promise<string>} URL de descarga de la imagen
 */
const uploadImage = async (imageAsset, reportId) => {
  try {
    if (!imageAsset || !imageAsset.uri) {
      throw new Error('No se proporcionó una imagen válida');
    }

    console.log('Iniciando subida de imagen...', imageAsset.uri);

    // Crear referencia única para la imagen
    const fileName = `flood-reports/${reportId}/${Date.now()}.jpg`;
    const imageRef = ref(storage, fileName);

    // Convertir la imagen a blob
    const response = await fetch(imageAsset.uri);
    if (!response.ok) {
      throw new Error(`Error al obtener la imagen: ${response.status}`);
    }
    
    const blob = await response.blob();

    // Validar tamaño del blob
    if (blob.size > 5 * 1024 * 1024) { // 5MB
      throw new Error('La imagen es demasiado grande (máximo 5MB)');
    }

    // Subir imagen con metadatos
    const metadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        'reportId': reportId,
        'uploadedAt': new Date().toISOString()
      }
    };

    const snapshot = await uploadBytes(imageRef, blob, metadata);

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    
    // Manejar errores específicos de Firebase
    if (error.code === 'storage/unauthorized') {
      throw new Error('No tienes permisos para subir archivos. Verifica la configuración de Firebase.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('La subida fue cancelada.');
    } else if (error.code === 'storage/unknown') {
      throw new Error('Error desconocido del servidor. Intenta nuevamente.');
    } else if (error.code === 'storage/invalid-format') {
      throw new Error('Formato de archivo no válido.');
    } else if (error.code === 'storage/invalid-event-name') {
      throw new Error('Nombre de evento inválido.');
    }
    
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }
};

/**
 * Crea un nuevo reporte de inundación
 * @param {Object} reportData - Datos del reporte
 * @returns {Promise<string>} ID del reporte creado
 */
export const createFloodReport = async (reportData) => {
  try {
    const { description, severityLevel, location, image } = reportData;

    // Validar datos requeridos
    if (!description || description.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    if (!location || !location.coords) {
      throw new Error('La ubicación es requerida');
    }

    if (!severityLevel) {
      throw new Error('El nivel de severidad es requerido');
    }


    // Generar ID único para el reporte
    const reportId = `flood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Preparar datos del reporte
    const reportToSave = {
      id: reportId,
      description: description.trim(),
      severityLevel,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || null,
        timestamp: location.timestamp || null,
      },
      status: 'pending', // pending, verified, resolved
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      imageUrl: null, // Se actualizará si hay imagen
    };

    // Subir imagen si existe
    if (image) {
      try {
        
        // Usar la función de diagnóstico mejorada
        const imageUrl = await uploadImageWithDiagnostics(image, reportId);
        reportToSave.imageUrl = imageUrl;
      } catch (imageError) {
        console.error('Error subiendo imagen, continuando sin imagen:', imageError);
      }
    }

    // Guardar reporte en Firestore
    const docRef = await addDoc(collection(db, 'floodReports'), reportToSave);
 
    return docRef.id;
  } catch (error) {
    console.error('Error creando reporte:', error);
    throw error;
  }
};

/**
 * Valida los datos de un reporte antes de enviarlo
 * @param {Object} reportData - Datos del reporte a validar
 * @returns {Object} Resultado de la validación
 */
export const validateReport = (reportData) => {
  const errors = [];

  if (!reportData.description || reportData.description.trim().length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  }

  if (!reportData.location || !reportData.location.coords) {
    errors.push('La ubicación es requerida');
  }

  if (!reportData.severityLevel) {
    errors.push('El nivel de severidad es requerido');
  }

  const severityLevels = ['Leve', 'Moderado', 'Severo'];
  if (reportData.severityLevel && !severityLevels.includes(reportData.severityLevel)) {
    errors.push('Nivel de severidad inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Función de diagnóstico para Firebase - exportar para uso en componentes
 */
export const runFirebaseDiagnostics = async () => {
  console.log('Ejecutando diagnósticos de Firebase...');
  
  // Diagnóstico básico
  diagnoseFirebase();
  
  // Test de conectividad
  const connectionTest = await testStorageConnection();
  console.log('Resultado del test de conexión:', connectionTest);
  
  return connectionTest;
};