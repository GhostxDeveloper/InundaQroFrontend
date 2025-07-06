# InundaQro

Sistema de alertas y reportes de inundaciones para Querétaro, desarrollado en React Native con Expo.

## Descripción

**InundaQro** es una aplicación móvil que permite:
- Visualizar reportes de inundaciones en tiempo real en un mapa.
- Reportar nuevas inundaciones con ubicación, severidad, descripción y foto.
- Recibir notificaciones y alertas.
- Consultar predicciones meteorológicas relevantes.

## Características principales

- **Mapa interactivo:** Visualiza reportes de inundación con diferentes niveles de severidad.
- **Reporte de inundaciones:** Permite a los usuarios enviar reportes con foto y ubicación.
- **Notificaciones:** Recibe alertas push sobre nuevas inundaciones o cambios de nivel de alerta.
- **Predicciones:** Consulta predicciones meteorológicas para la zona.
- **Autenticación:** Registro y login de usuarios con verificación por correo electrónico.

## Estructura del proyecto

```
.
├── App.js
├── index.js
├── app.json
├── package.json
├── eas.json
├── assets/
├── Components/
│   └── Maps/
├── firebase/
│   └── firebaseConfig.js
├── pages/
│   ├── Home.js
│   ├── MapScreen.js
│   ├── ReportarInundacion.js
│   ├── PrediccionesScreen.js
│   └── auth/
├── routes/
│   └── routes.js
├── services/
├── styles/
├── utils/
```

## Instalación y configuración

### 1. Requisitos previos

- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Cuenta de Firebase y credenciales configuradas

### 2. Instalación de dependencias

```sh
npm install
```

### 3. Variables y configuración

- Asegúrate de tener el archivo de configuración de Firebase en `firebase/firebaseConfig.js`.
- Configura las claves de API de Google Maps en los componentes correspondientes si usas rutas reales.
- Para notificaciones push, revisa la configuración en `app.json` y los permisos en Android/iOS.

### 4. Ejecución en desarrollo

```sh
npm start
```
o usando Expo:
```sh
expo start
```
Luego escanea el QR con la app de Expo Go o ejecuta en un emulador.

### 5. Compilación para producción

Usa EAS Build:
```sh
eas build --platform android
eas build --platform ios
```

## Funcionamiento general

- **Pantalla principal:** Muestra alertas, predicciones y accesos rápidos.
- **Mapa:** Acceso desde el menú principal, muestra reportes y permite navegar a ubicaciones.
- **Reportar inundación:** Formulario para enviar un reporte con ubicación, severidad, descripción y foto opcional.
- **Notificaciones:** Se configuran y reciben usando `expo-notifications`.
- **Autenticación:** Registro y login con validación de email y contraseña.

## Servicios principales

- [`services/floodReportsService.js`](services/floodReportsService.js): Obtención y suscripción a reportes de inundación.
- [`services/reporteService.js`](services/reporteService.js): Creación y validación de reportes.
- [`services/locationService.js`](services/locationService.js): Permisos y obtención de ubicación.
- [`services/imageService.js`](services/imageService.js): Selección y validación de imágenes.
- [`services/usersService.js`](services/usersService.js): Registro y login de usuarios.

## Notas de operación

- Para el envío de correos de verificación, asegúrate de que el backend de envío de emails esté corriendo y accesible.
- Las imágenes subidas no deben superar los 5MB.
- Los permisos de ubicación y notificaciones deben estar habilitados en el dispositivo.

## Créditos

Desarrollado por el equipo de InundaQro.

---

**Contacto:**  
Para soporte o dudas, abre un issue o contacta al equipo