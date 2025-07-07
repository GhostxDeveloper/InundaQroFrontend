import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Text,
  Modal,
} from "react-native";
import * as Location from "expo-location";
import { styles } from "../styles/Mapstyles";
import {
  getAllFloodReports,
  subscribeToFloodReports,
} from "../services/floodReportsService";

// Componentes existentes
import MapHeader from "../Components/Maps/MapHeader";
import MapContainer from "../Components/Maps/MapContainer";
import NavigationControls from "../Components/Maps/NavigationControl";
import SearchModal from "../Components/Maps/SearchModal";
import LocationPreviewModal from "../Components/Maps/LocationPreviewModal";

// Componente de navegación guiada
import GuidedNavigation from "../Components/Maps/GuidedNavigation";

const MapScreen = ({ navigation }) => {
  // Estados principales
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState("standard");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Estados para preview de ubicación
  const [showLocationPreview, setShowLocationPreview] = useState(false);
  const [previewLocation, setPreviewLocation] = useState(null);

  // Estados para navegación guiada
  const [showGuidedNavigation, setShowGuidedNavigation] = useState(false);
  const [guidedDestination, setGuidedDestination] = useState(null);
  const [guidedDestinationName, setGuidedDestinationName] = useState("");

  // Estados para reportes
  const [floodReports, setFloodReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [showFloodReports, setShowFloodReports] = useState(true);
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState("all");

  const mapRef = useRef(null);
  const reportsUnsubscribe = useRef(null);

  const initialRegion = {
    latitude: 20.5888,
    longitude: -100.38806,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    getCurrentLocation();
    startLocationTracking();
    loadFloodReports();

    return () => {
      if (reportsUnsubscribe.current) {
        reportsUnsubscribe.current();
      }
    };
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos necesarios",
          "La app necesita acceso a tu ubicación para funcionar correctamente",
          [{ text: "Entendido" }]
        );
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newLocation);
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      Alert.alert("Error", "No se pudo obtener tu ubicación actual");
      setLocation(initialRegion);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const updatedLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: location?.latitudeDelta || 0.01,
            longitudeDelta: location?.longitudeDelta || 0.01,
          };
          setLocation(updatedLocation);
        }
      );
    }
  };

  const loadFloodReports = async () => {
    try {
      setLoadingReports(true);

      reportsUnsubscribe.current = subscribeToFloodReports((reports) => {
        setFloodReports(reports);
        setLoadingReports(false);
      });
    } catch (error) {
      console.error("Error cargando reportes:", error);
      setLoadingReports(false);

      try {
        const reports = await getAllFloodReports();
        setFloodReports(reports);
      } catch (fallbackError) {
        console.error("Error en fallback:", fallbackError);
        Alert.alert(
          "Error",
          "No se pudieron cargar los reportes de inundación"
        );
      }
    }
  };

  const getFilteredReports = () => {
    if (selectedSeverityFilter === "all") {
      return floodReports;
    }
    return floodReports.filter(
      (report) => report.severityLevel === selectedSeverityFilter
    );
  };

  // Función para mostrar preview de ubicación
  const showLocationPreviewModal = (location) => {
    setPreviewLocation(location);
    setShowLocationPreview(true);
    setSearchText(location.name);
    setShowSearchModal(false);

    // Centrar el mapa en la ubicación seleccionada
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  // Función para iniciar navegación guiada directamente
  const startNavigation = (destinationCoord, destinationName) => {
    if (!location) {
      Alert.alert("Error", "No se pudo obtener tu ubicación actual");
      return;
    }

    // Configurar datos para navegación guiada
    setGuidedDestination(destinationCoord);
    setGuidedDestinationName(destinationName);
    setShowGuidedNavigation(true);

    // Limpiar estados del preview
    setShowLocationPreview(false);
    setPreviewLocation(null);
    setSearchText("");
  };

  // Función para completar navegación guiada
  const handleGuidedNavigationComplete = () => {
    setShowGuidedNavigation(false);
    setGuidedDestination(null);
    setGuidedDestinationName("");

    Alert.alert("¡Llegaste a tu destino!", "¿Cómo estuvo tu viaje?", [
      { text: "Excelente", onPress: () => console.log("Feedback: Excelente") },
      { text: "Bien", onPress: () => console.log("Feedback: Bien") },
      { text: "Cerrar", style: "cancel" },
    ]);
  };

  // Función para cancelar navegación guiada
  const handleGuidedNavigationCancel = () => {
    Alert.alert(
      "Cancelar navegación",
      "¿Estás seguro de que quieres cancelar la navegación?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          onPress: () => {
            setShowGuidedNavigation(false);
            setGuidedDestination(null);
            setGuidedDestinationName("");
          },
        },
      ]
    );
  };

  const centerOnUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Obteniendo tu ubicación...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4285F4" barStyle="light-content" />

      {showGuidedNavigation ? (
        <Modal
          visible={showGuidedNavigation}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <GuidedNavigation
            origin={location}
            destination={guidedDestination}
            destinationName={guidedDestinationName}
            onNavigationComplete={handleGuidedNavigationComplete}
            onNavigationCancel={handleGuidedNavigationCancel}
            mapType={mapType}
            showTraffic={true}
            showFloodReports={showFloodReports} // Pasar el estado de reportes
            selectedSeverityFilter={selectedSeverityFilter} // Pasar el filtro de severidad
          />
        </Modal>
      ) : (
        <>
          {/* Interfaz normal del mapa */}
          <MapHeader
            navigation={navigation}
            searchText={searchText}
            mapType={mapType}
            setMapType={setMapType}
            setShowSearchModal={setShowSearchModal}
            floodReports={floodReports}
            selectedSeverityFilter={selectedSeverityFilter}
            setSelectedSeverityFilter={setSelectedSeverityFilter}
            loadingReports={loadingReports}
          />

          <MapContainer
            mapRef={mapRef}
            location={location}
            initialRegion={initialRegion}
            mapType={mapType}
            showFloodReports={showFloodReports}
            filteredReports={getFilteredReports()}
            previewLocation={previewLocation}
          />

          <NavigationControls
            showFloodReports={showFloodReports}
            setShowFloodReports={setShowFloodReports}
            onCenterLocation={centerOnUserLocation}
            loadingReports={loadingReports}
          />

          <SearchModal
            visible={showSearchModal}
            searchText={searchText}
            setSearchText={setSearchText}
            onClose={() => setShowSearchModal(false)}
            onSelectDestination={showLocationPreviewModal}
          />

          <LocationPreviewModal
            visible={showLocationPreview}
            location={previewLocation}
            userLocation={location}
            onClose={() => {
              setShowLocationPreview(false);
              setPreviewLocation(null);
            }}
            onStartNavigation={startNavigation}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;
