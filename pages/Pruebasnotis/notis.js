import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert, StyleSheet } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Configurar cómo se manejan las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Registrar para push notifications
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Listener para cuando se recibe una notificación
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener para cuando el usuario toca la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuario tocó la notificación:', response);
      Alert.alert('Notificación tocada', JSON.stringify(response.notification.request.content.data, null, 2));
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Función para enviar notificación local (inmediata)
  const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Notificación Local! 📱",
        body: 'Esta es una notificación de prueba enviada localmente',
        data: { someData: 'valor de ejemplo' },
      },
      trigger: null, // null = inmediata
    });
  };

  // Función para programar notificación local (en 5 segundos)
  const scheduleLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Notificación Programada ⏰",
        body: 'Esta notificación fue programada hace 5 segundos',
        data: { scheduled: true },
      },
      trigger: { seconds: 5 },
    });
    Alert.alert('Programada', 'Notificación programada para dentro de 5 segundos');
  };

  // Función simulada para push notification (no funciona en Expo Go SDK 53+)
  const sendPushNotification = async () => {
    Alert.alert(
      'Push Notifications no disponibles', 
      'Las push notifications remotas requieren un Development Build. Por ahora puedes probar con notificaciones locales.',
      [
        { text: 'OK', onPress: () => console.log('Usuario informado sobre limitación') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prueba de Notificaciones Push</Text>
      
      <Text style={styles.tokenText}>
        Push Token: {expoPushToken ? '✅ Token obtenido' : '❌ No disponible'}
      </Text>
      
      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>Última notificación recibida:</Text>
          <Text style={styles.notificationText}>
            {notification.request.content.title}: {notification.request.content.body}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Enviar Notificación Local"
          onPress={sendLocalNotification}
          color="#007AFF"
        />
        
        <Button
          title="Programar Notificación (5s)"
          onPress={scheduleLocalNotification}
          color="#FF9500"
        />
        
        <Button
          title="Push Notification (Requiere Dev Build)"
          onPress={sendPushNotification}
          color="#999999"
        />
      </View>
    </View>
  );
}

// Función para registrar el dispositivo para push notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('¡Error! No se pudieron obtener los permisos para push notifications.');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  } else {
    alert('Debes usar un dispositivo físico para push notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tokenText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  notificationContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
});