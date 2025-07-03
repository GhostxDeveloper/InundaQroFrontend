import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

// Importar servicios
import { requestLocationPermission } from '../services/locationService';
import { showImagePicker } from '../services/imageService';
import { createFloodReport, validateReport } from '../services/reporteService';

// Importar utilidades y estilos
import { 
  getSeverityColor, 
  getSeverityDescription, 
  formatCoordinates
} from '../utils/helpers';
import { styles } from '../styles/reportStyles';

const ReportarInundacion = ({ navigation }) => {
  // Estados del componente
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [severityLevel, setSeverityLevel] = useState('Leve');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efecto para obtener ubicación al cargar
  useEffect(() => {
    handleLocationRequest();
  }, []);

  // Manejar solicitud de ubicación
  const handleLocationRequest = async () => {
    setLoading(true);
    
    const result = await requestLocationPermission();
    
    if (result.success) {
      setLocation(result.location);
      setLocationError(null);
    } else {
      setLocationError(result.error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Intenta nuevamente.');
    }
    
    setLoading(false);
  };

  // Manejar selección de imagen
  const handleImageSelection = (selectedImage) => {
    setImage(selectedImage);
  };

  // Enviar reporte
  const handleSubmitReport = async () => {
    // Validaciones básicas
    if (!location) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación. Intenta refrescar.');
      return;
    }

    if (description.trim().length < 10) {
      Alert.alert('Error', 'Por favor proporciona una descripción más detallada (mínimo 10 caracteres).');
      return;
    }

    try {
      setIsSubmitting(true);

      // Crear el reporte
      await createFloodReport({
        description,
        severityLevel,
        location,
        image
      });

      Alert.alert(
        'Reporte enviado',
        'Tu reporte ha sido enviado exitosamente. Gracias por ayudar a mantener segura nuestra comunidad.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema al enviar tu reporte. Por favor intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar sección de ubicación
  const renderLocationSection = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>📍 Ubicación</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3b82f6" />
          <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
        </View>
      ) : locationError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleLocationRequest}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : location ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            Lat: {formatCoordinates(location.coords)?.latitude}
          </Text>
          <Text style={styles.locationText}>
            Lng: {formatCoordinates(location.coords)?.longitude}
          </Text>
          <Text style={styles.accuracyText}>
            Precisión: ±{formatCoordinates(location.coords)?.accuracy}m
          </Text>
        </View>
      ) : null}
    </View>
  );

  // Renderizar sección de severidad
  const renderSeveritySection = () => {
    const severityLevels = ['Leve', 'Moderado', 'Severo'];
    
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>⚠️ Nivel de Severidad</Text>
        <View style={styles.severityContainer}>
          {severityLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.severityButton,
                { 
                  backgroundColor: severityLevel === level ? getSeverityColor(level) : '#f3f4f6',
                  borderColor: getSeverityColor(level)
                }
              ]}
              onPress={() => setSeverityLevel(level)}
            >
              <Text style={[
                styles.severityText,
                { color: severityLevel === level ? 'white' : getSeverityColor(level) }
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.severityDescription}>
          {getSeverityDescription(severityLevel)}
        </Text>
      </View>
    );
  };

  // Renderizar sección de imagen
  const renderImageSection = () => (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>📸 Fotografía (Opcional)</Text>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.selectedImage} />
          <TouchableOpacity 
            style={styles.changeImageButton} 
            onPress={() => showImagePicker(handleImageSelection)}
          >
            <Text style={styles.changeImageText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.addImageButton} 
          onPress={() => showImagePicker(handleImageSelection)}
        >
          <Text style={styles.addImageIcon}>📷</Text>
          <Text style={styles.addImageText}>Tomar o seleccionar foto</Text>
          <Text style={styles.addImageSubtext}>Ayuda a verificar el reporte</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Renderizar sección de descripción
  const renderDescriptionSection = () => {
    const maxLength = 500;
    
    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📝 Descripción</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describe la situación: ubicación específica, nivel del agua, afectaciones, etc."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={maxLength}
          textAlignVertical="top"
        />
        <Text style={styles.characterCount}>
          {description.length}/{maxLength} caracteres
        </Text>
      </View>
    );
  };

  // Renderizar información adicional
  const renderInfoSection = () => (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>ℹ️ Información importante</Text>
      <Text style={styles.infoText}>
        • Tu reporte será revisado por las autoridades competentes
      </Text>
      <Text style={styles.infoText}>
        • La información de ubicación es crucial para la respuesta
      </Text>
      <Text style={styles.infoText}>
        • En caso de emergencia inmediata, llama al 911
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1e40af" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reportar Inundación</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Secciones del formulario */}
        {renderLocationSection()}
        {renderSeveritySection()}
        {renderImageSection()}
        {renderDescriptionSection()}

        {/* Botón de envío */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { opacity: isSubmitting ? 0.6 : 1 }
          ]}
          onPress={handleSubmitReport}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submitLoadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.submitButtonText}>Enviando...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Enviar Reporte</Text>
          )}
        </TouchableOpacity>

        {/* Información adicional */}
        {renderInfoSection()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export default ReportarInundacion;