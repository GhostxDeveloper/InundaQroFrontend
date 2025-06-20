import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {mapHeaderStyles as styles } from '../../styles/MapHeaderstyles';

const MapHeader = ({
  navigation,
  searchText,
  mapType,
  setMapType,
  setShowSearchModal,
  floodReports,
  selectedSeverityFilter,
  setSelectedSeverityFilter,
  loadingReports,
}) => {
  return (
    <>
      {/* Barra de búsqueda */}
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.searchInput} onPress={() => setShowSearchModal(true)}>
          <Text style={[styles.searchInputText, { color: searchText ? '#000' : '#666' }]}>
            {searchText || '¿A dónde quieres ir?'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mapTypeButton} 
          onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
        >
          <Text style={styles.mapTypeButtonText}>
            {mapType === 'standard' ? '🛰️' : '🗺️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de severidad */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterButton, selectedSeverityFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedSeverityFilter('all')}
          >
            <Text style={[styles.filterButtonText, selectedSeverityFilter === 'all' && styles.filterButtonTextActive]}>
              Todos ({floodReports.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedSeverityFilter === 'Leve' && styles.filterButtonActive]}
            onPress={() => setSelectedSeverityFilter('Leve')}
          >
            <Text style={[styles.filterButtonText, selectedSeverityFilter === 'Leve' && styles.filterButtonTextActive]}>
             🟢 Leve ({floodReports.filter(r => r.severityLevel === 'Leve').length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedSeverityFilter === 'Moderado' && styles.filterButtonActive]}
            onPress={() => setSelectedSeverityFilter('Moderado')}
          >
            <Text style={[styles.filterButtonText, selectedSeverityFilter === 'Moderado' && styles.filterButtonTextActive]}>
              🟠 Moderado ({floodReports.filter(r => r.severityLevel === 'Moderado').length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedSeverityFilter === 'Severo' && styles.filterButtonActive]}
            onPress={() => setSelectedSeverityFilter('Severo')}
          >
            <Text style={[styles.filterButtonText, selectedSeverityFilter === 'Severo' && styles.filterButtonTextActive]}>
              🔴 Severo ({floodReports.filter(r => r.severityLevel === 'Severo').length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Indicador de carga de reportes */}
      {loadingReports && (
        <View style={styles.loadingReportsIndicator}>
          <ActivityIndicator size="small" color="#4285F4" />
          <Text style={styles.loadingReportsText}>Cargando reportes...</Text>
        </View>
      )}
    </>
  );
};

export default MapHeader;