// services/firebaseService.js
import { storage, db } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Diagnostica la configuración de Firebase
 */
export const diagnoseFirebase = () => {
  
  try {
    
    if (storage) {
    }
    
    if (db) {
    }
    
  } catch (error) {
  }
  
};

/**
 * Prueba la conectividad con Firebase Storage
 */
export const testStorageConnection = async () => {
  try {
    
    // Crear una referencia de prueba
    const testRef = ref(storage, 'test-connection.txt');
    
    // Intentar subir un archivo pequeño de prueba
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    
    const snapshot = await uploadBytes(testRef, testBlob);
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('URL de descarga obtenida:', downloadURL);
    
    return { success: true, url: downloadURL };
    
  } catch (error) {
    console.error('Error en test de Storage:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

/**
 * Versión mejorada de subida de imagen con más diagnósticos
 */
export const uploadImageWithDiagnostics = async (imageAsset, reportId) => {
  try {
    if (!imageAsset || !imageAsset.uri) {
      throw new Error('No se proporcionó una imagen válida');
    }

    // Verificar que Firebase Storage esté configurado
    if (!storage) {
      throw new Error('Firebase Storage no está configurado');
    }


    // Crear referencia única para la imagen
    const fileName = `flood-reports/${reportId}/${Date.now()}.jpg`;
    const imageRef = ref(storage, fileName);

    // Convertir la imagen a blob con más información
    const response = await fetch(imageAsset.uri);
    
    if (!response.ok) {
      throw new Error(`Error al obtener la imagen: ${response.status} - ${response.statusText}`);
    }
    
    const blob = await response.blob();

    // Validar tamaño del blob
    if (blob.size > 10 * 1024 * 1024) { // 10MB límite más generoso
      throw new Error('La imagen es demasiado grande (máximo 10MB)');
    }

    if (blob.size === 0) {
      throw new Error('La imagen está vacía');
    }

    // Metadatos más completos
    const metadata = {
      contentType: imageAsset.mimeType || 'image/jpeg',
      cacheControl: 'public,max-age=3600',
      customMetadata: {
        'reportId': reportId,
        'uploadedAt': new Date().toISOString(),
        'originalSize': imageAsset.fileSize?.toString() || 'unknown',
        'fileName': imageAsset.fileName || 'unknown'
      }
    };

    
    // Subir con timeout
    const uploadPromise = uploadBytes(imageRef, blob, metadata);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: La subida tardó más de 30 segundos')), 30000);
    });

    const snapshot = await Promise.race([uploadPromise, timeoutPromise]);

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (error) {
    if (error.serverResponse) {
    }
    
    // Manejar errores específicos
    if (error.code === 'storage/unauthorized') {
      throw new Error('Sin permisos para subir archivos. Verifica las reglas de Firebase Storage.');
    } else if (error.code === 'storage/canceled') {
      throw new Error('La subida fue cancelada.');
    } else if (error.code === 'storage/unknown') {
      throw new Error(`Error del servidor Firebase Storage. Código: ${error.code}. Verifica la configuración del proyecto.`);
    } else if (error.code === 'storage/invalid-format') {
      throw new Error('Formato de archivo no válido.');
    } else if (error.code === 'storage/quota-exceeded') {
      throw new Error('Cuota de almacenamiento excedida.');
    } else if (error.message.includes('Timeout')) {
      throw new Error('La subida tardó demasiado. Verifica tu conexión a internet.');
    }
    
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }
};