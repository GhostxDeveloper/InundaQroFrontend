import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Config de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxwj6_9WJaQz_ZwLoMjw-MFBq7dP93Sd4",
  authDomain: "inundaqro-f2dfa.firebaseapp.com",
  projectId: "inundaqro-f2dfa",
  storageBucket: "inundaqro-f2dfa.appspot.com",
  messagingSenderId: "996217041551",
  appId: "1:996217041551:web:c64050ec1310c80de876fa",
};

// Inicializa app
const app = initializeApp(firebaseConfig);

// Inicializa servicios
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
