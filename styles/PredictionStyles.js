import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
        width: 32, // Ajusta este valor si tu backButton es más ancho
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
});