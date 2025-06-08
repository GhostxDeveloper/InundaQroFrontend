// services/firebaseService.js
import { storage, db } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Diagnostica la configuración de Firebase
 */
export const diagnoseFirebase = () => {
  console.log('=== DIAGNÓSTICO FIREBASE ===');
  
  try {
    console.log('Storage disponible:', !!storage);
    console.log('DB disponible:', !!db);
    
    if (storage) {
      console.log('Storage app:', storage.app.name);
      console.log('Storage bucket:', storage._bucket);
    }
    
    if (db) {
      console.log('DB app:', db.app.name);
      console.log('DB settings:', db._settings);
    }
    
  } catch (error) {
    console.error('Error en diagnóstico:', error);
  }
  
  console.log('============================');
};

/**
 * Prueba la conectividad con Firebase Storage
 */
export const testStorageConnection = async () => {
  try {
    console.log('Probando conexión con Storage...');
    
    // Crear una referencia de prueba
    const testRef = ref(storage, 'test-connection.txt');
    console.log('Referencia de prueba creada:', testRef.fullPath);
    
    // Intentar subir un archivo pequeño de prueba
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    
    console.log('Intentando subir archivo de prueba...');
    const snapshot = await uploadBytes(testRef, testBlob);
    console.log('Archivo de prueba subido exitosamente');
    
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

    console.log('=== INICIO SUBIDA IMAGEN ===');
    console.log('URI de imagen:', imageAsset.uri);
    console.log('Tamaño de archivo:', imageAsset.fileSize);
    console.log('Tipo MIME:', imageAsset.mimeType);
    console.log('Report ID:', reportId);

    // Verificar que Firebase Storage esté configurado
    if (!storage) {
      throw new Error('Firebase Storage no está configurado');
    }

    console.log('Storage bucket:', storage._bucket);

    // Crear referencia única para la imagen
    const fileName = `flood-reports/${reportId}/${Date.now()}.jpg`;
    const imageRef = ref(storage, fileName);
    console.log('Referencia creada:', imageRef.fullPath);
    console.log('Bucket:', imageRef.bucket);

    // Convertir la imagen a blob con más información
    console.log('Obteniendo imagen desde URI...');
    const response = await fetch(imageAsset.uri);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`Error al obtener la imagen: ${response.status} - ${response.statusText}`);
    }
    
    const blob = await response.blob();
    console.log('Blob creado:');
    console.log('- Tamaño:', blob.size);
    console.log('- Tipo:', blob.type);
    console.log('- Constructor:', blob.constructor.name);

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

    console.log('Metadatos:', metadata);
    console.log('Iniciando subida a Firebase Storage...');
    
    // Subir con timeout
    const uploadPromise = uploadBytes(imageRef, blob, metadata);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: La subida tardó más de 30 segundos')), 30000);
    });

    const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
    console.log('Imagen subida exitosamente');
    console.log('Snapshot metadata:', snapshot.metadata);

    // Obtener URL de descarga
    console.log('Obteniendo URL de descarga...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('URL de descarga obtenida:', downloadURL);

    console.log('=== FIN SUBIDA EXITOSA ===');
    return downloadURL;

  } catch (error) {
    console.error('=== ERROR EN SUBIDA ===');
    console.error('Error completo:', error);
    console.error('Código de error:', error.code);
    console.error('Mensaje:', error.message);
    
    if (error.serverResponse) {
      console.error('Respuesta del servidor:', error.serverResponse);
    }
    
    console.error('======================');
    
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