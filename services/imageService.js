// services/imageService.js
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/**
 * Obtiene el tipo de media correcto según la versión de expo-image-picker
 */
const getMediaType = () => {
  // Intentar usar la nueva API primero
  if (ImagePicker.MediaType && ImagePicker.MediaType.Images) {
    return ImagePicker.MediaType.Images;
  }
  
  // Fallback a la API antigua
  if (ImagePicker.MediaTypeOptions && ImagePicker.MediaTypeOptions.Images) {
    return ImagePicker.MediaTypeOptions.Images;
  }
  
  // Fallback final usando string
  return 'Images';
};

/**
 * Solicita permisos para acceder a la cámara y galería
 */
const requestPermissions = async () => {
  try {
    // Solicitar permisos de cámara
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Se necesitan permisos de cámara y galería para tomar o seleccionar fotos.'
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error solicitando permisos:', error);
    return false;
  }
};

/**
 * Muestra opciones para seleccionar imagen (cámara o galería)
 */
export const showImagePicker = async (onImageSelected) => {
  try {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        {
          text: 'Cámara',
          onPress: () => openCamera(onImageSelected),
        },
        {
          text: 'Galería',
          onPress: () => openGallery(onImageSelected),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  } catch (error) {
    console.error('Error en showImagePicker:', error);
    Alert.alert('Error', 'Hubo un problema al acceder a las opciones de imagen.');
  }
};

/**
 * Abre la cámara para tomar una foto
 */
const openCamera = async (onImageSelected) => {
  try {
    console.log('Abriendo cámara...');
    
    const mediaType = getMediaType();
    console.log('Tipo de media:', mediaType);
    
    const options = {
      mediaTypes: mediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      exif: false,
    };
    
    console.log('Opciones de cámara:', options);
    
    const result = await ImagePicker.launchCameraAsync(options);
    console.log('Resultado de cámara:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageAsset = result.assets[0];
      console.log('Imagen seleccionada:', imageAsset);
      
      // Validar tamaño del archivo (máximo 5MB)
      if (imageAsset.fileSize && imageAsset.fileSize > 5 * 1024 * 1024) {
        Alert.alert('Error', 'La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB.');
        return;
      }

      onImageSelected(imageAsset);
    } else {
      console.log('Cámara cancelada o sin resultado');
    }
  } catch (error) {
    console.error('Error abriendo cámara:', error);
    Alert.alert('Error', `No se pudo acceder a la cámara: ${error.message}`);
  }
};

/**
 * Abre la galería para seleccionar una foto
 */
const openGallery = async (onImageSelected) => {
  try {
    console.log('Abriendo galería...');
    
    const mediaType = getMediaType();
    console.log('Tipo de media:', mediaType);
    
    const options = {
      mediaTypes: mediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      exif: false,
    };
    
    console.log('Opciones de galería:', options);
    
    const result = await ImagePicker.launchImageLibraryAsync(options);
    console.log('Resultado de galería:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageAsset = result.assets[0];
      console.log('Imagen seleccionada:', imageAsset);
      
      // Validar tamaño del archivo (máximo 5MB)
      if (imageAsset.fileSize && imageAsset.fileSize > 5 * 1024 * 1024) {
        Alert.alert('Error', 'La imagen es demasiado grande. Por favor selecciona una imagen menor a 5MB.');
        return;
      }

      onImageSelected(imageAsset);
    } else {
      console.log('Galería cancelada o sin resultado');
    }
  } catch (error) {
    console.error('Error abriendo galería:', error);
    Alert.alert('Error', `No se pudo acceder a la galería: ${error.message}`);
  }
};

/**
 * Función de debug para verificar la API disponible
 */
export const debugImagePickerAPI = () => {
  console.log('=== DEBUG IMAGE PICKER API ===');
  console.log('ImagePicker:', !!ImagePicker);
  console.log('ImagePicker.MediaType:', ImagePicker.MediaType);
  console.log('ImagePicker.MediaTypeOptions:', ImagePicker.MediaTypeOptions);
  console.log('launchCameraAsync:', !!ImagePicker.launchCameraAsync);
  console.log('launchImageLibraryAsync:', !!ImagePicker.launchImageLibraryAsync);
  console.log('getMediaType():', getMediaType());
  console.log('===============================');
};