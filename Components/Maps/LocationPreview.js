// Components/Maps/LocationPreview.js

import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../../styles/Mapstyles';
const LocationPreview = ({ 
  visible, 
  location, 
  onStartNavigation, 
  onClose 
}) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.previewContainer}>
        <View style={styles.previewCard}>
          <Text style={styles.locationName}>{location?.name}</Text>
          <Text style={styles.locationAddress}>{location?.address}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.navigateButton}
              onPress={() => onStartNavigation(location.coordinate, location.name)}
            >
              <Text style={styles.buttonText}>Iniciar navegación</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocationPreview;