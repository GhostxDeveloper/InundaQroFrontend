import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },

    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
    },

    scrollContainer: {
        flex: 1,
    },

    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2E86AB',
        paddingHorizontal: 20,
        paddingVertical: 24,
        paddingTop: 40,
    },

    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 0,
    },

    headerSubtitle: {
        fontSize: 14,
        color: '#B8E0FF',
        opacity: 0.9,
    },

    backButton: {
        padding: 8,
    },

    backIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },

    placeholder: {
        width: 32,
    },

    // Chart Section
    chartContainer: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
    },

    chartWrapper: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FAFAFA',
    },

    chart: {
        height: 300,
        backgroundColor: 'transparent',
    },

    // Risk Zones Section
    riskContainer: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        marginTop: 0,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    riskScrollView: {
        marginTop: 8,
    },

    riskCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
        minWidth: 140,
        borderLeftWidth: 4,
    },

    riskZoneName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 4,
    },

    riskLevel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },

    riskFrequency: {
        fontSize: 11,
        color: '#666666',
    },

    // Map Section
    mapContainer: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        marginTop: 0,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    mapSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 12,
        lineHeight: 20,
    },

    mapWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        height: 350,
        marginBottom: 16,
    },

    map: {
        flex: 1,
    },

    // Legend
    legend: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },

    legendTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginRight: 16,
    },

    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginVertical: 2,
    },

    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },

    legendText: {
        fontSize: 12,
        color: '#666666',
    },

    // Info Section
    infoContainer: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        marginTop: 0,
        marginBottom: 32,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 12,
    },

    infoText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 22,
        marginBottom: 8,
        textAlign: 'justify',
    },

    // Responsive adjustments
    '@media (max-width: 360px)': {
        headerTitle: {
            fontSize: 20,
        },
        sectionTitle: {
            fontSize: 16,
        },
        chart: {
            height: 250,
        },
        mapWrapper: {
            height: 300,
        },
    },

    // Estilos de búsqueda mejorados - Reemplaza la sección de búsqueda en tu PredictionStyles.js

    // Contenedor de búsqueda
    searchContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },

    searchSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 20,
        lineHeight: 20,
        textAlign: 'center',
    },

    // Campo de búsqueda mejorado
    searchInputContainer: {
        position: 'relative',
        marginBottom: 16,
    },

    searchInput: {
        height: 50,
        borderWidth: 2,
        borderColor: '#E8F4FD',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingRight: 50, // Espacio para el loader
        fontSize: 16,
        backgroundColor: '#FAFCFF',
        color: '#333333',
        fontWeight: '500',
        // Sombra sutil interna
        shadowColor: '#2E86AB',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    // Estilo cuando el input está enfocado
    searchInputFocused: {
        borderColor: '#2E86AB',
        backgroundColor: '#FFFFFF',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    searchInputLoader: {
        position: 'absolute',
        right: 16,
        top: 13,
    },

    // Contenedor de sugerencias mejorado
    suggestionsContainer: {
        maxHeight: 220,
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },

    suggestionItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F7FA',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 60,
    },

    // Efecto hover para sugerencias
    suggestionItemPressed: {
        backgroundColor: '#F8FCFF',
    },

    suggestionIcon: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2E86AB',
        marginRight: 12,
    },

    suggestionContent: {
        flex: 1,
    },

    suggestionName: {
        fontSize: 15,
        color: '#333333',
        fontWeight: '600',
        marginBottom: 2,
        lineHeight: 20,
    },

    suggestionAddress: {
        fontSize: 13,
        color: '#666666',
        lineHeight: 18,
    },

    // Mapa de búsqueda mejorado
    searchMapWrapper: {
        height: 220,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E8F4FD',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    searchMap: {
        flex: 1,
    },

    // Botón de confirmación mejorado
    confirmButton: {
        backgroundColor: '#2E86AB',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
        shadowColor: '#2E86AB',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },

    confirmButtonPressed: {
        backgroundColor: '#1E5F7A',
        transform: [{ scale: 0.98 }],
    },

    confirmButtonDisabled: {
        backgroundColor: '#B0C4DE',
        shadowOpacity: 0.1,
        elevation: 1,
    },

    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 0.5,
    },

    // Indicador de ubicación seleccionada
    selectedLocationIndicator: {
        backgroundColor: '#E8F4FD',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#2E86AB',
    },

    selectedLocationText: {
        fontSize: 14,
        color: '#2E86AB',
        fontWeight: '600',
        marginBottom: 4,
    },

    selectedLocationAddress: {
        fontSize: 12,
        color: '#666666',
        lineHeight: 16,
    },

    // Estados de carga
    searchLoadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },

    searchLoadingText: {
        marginTop: 8,
        fontSize: 14,
        color: '#2E86AB',
        fontWeight: '500',
    },

    // Mensaje cuando no hay resultados
    noResultsContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 16,
    },

    noResultsIcon: {
        fontSize: 32,
        color: '#CCCCCC',
        marginBottom: 8,
    },

    noResultsText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Botón para limpiar búsqueda
    clearSearchButton: {
        position: 'absolute',
        right: 16,
        top: 13,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    clearSearchIcon: {
        fontSize: 12,
        color: '#666666',
        fontWeight: 'bold',
    },

    // Animaciones y transiciones
    fadeIn: {
        opacity: 1,
    },

    fadeOut: {
        opacity: 0,
    },

    // Responsive para pantallas pequeñas
    '@media (max-width: 360px)': {
        searchContainer: {
            marginHorizontal: 12,
            padding: 16,
        },

        searchInput: {
            height: 46,
            fontSize: 15,
        },

        searchMapWrapper: {
            height: 180,
        },

        confirmButton: {
            paddingVertical: 14,
            minHeight: 48,
        },

        confirmButtonText: {
            fontSize: 15,
        },

        suggestionItem: {
            padding: 14,
            minHeight: 56,
        },

        suggestionName: {
            fontSize: 14,
        },

        suggestionAddress: {
            fontSize: 12,
        },
    },
});

const additionalStyles = {
    // Indicador de predicción personalizada activa
    customPredictionIndicator: {
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 16,
        marginVertical: 12,
        borderWidth: 2,
        borderColor: '#2E86AB',
        borderStyle: 'dashed',
    },

    customPredictionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    customPredictionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E86AB',
        flex: 1,
    },

    clearCustomButton: {
        backgroundColor: '#FF4444',
        borderRadius: 20,
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },

    clearCustomIcon: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    customPredictionContent: {
        paddingLeft: 4,
    },

    customPredictionLocation: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 4,
        fontWeight: '600',
    },

    customPredictionRisk: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '600',
    },

    customPredictionFrequency: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 6,
    },

    customPredictionNote: {
        fontSize: 12,
        color: '#888888',
        fontStyle: 'italic',
    },

    // Tarjeta de riesgo personalizada
    customRiskCard: {
        backgroundColor: '#F8F9FA',
        borderWidth: 2,
        borderColor: '#2E86AB',
        borderStyle: 'dashed',
    },

    customRiskLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2E86AB',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 4,
        textAlign: 'center',
    },
};
export const combinedStyles = { ...styles, ...additionalStyles };

