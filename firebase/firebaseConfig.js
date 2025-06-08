

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCxwj6_9WJaQz_ZwLoMjw-MFBq7dP93Sd4",
  authDomain: "inundaqro-f2dfa.firebaseapp.com",
  projectId: "inundaqro-f2dfa",
  storageBucket: "inundaqro-f2dfa.firebasestorage.app",
  messagingSenderId: "996217041551",
  appId: "1:996217041551:web:c64050ec1310c80de876fa"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;