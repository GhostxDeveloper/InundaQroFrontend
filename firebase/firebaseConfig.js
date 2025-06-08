

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5DT907w855QasQUAxrz7eq6MDFi_tGbM",
  authDomain: "inundaqro.firebaseapp.com",
  projectId: "inundaqro",
  storageBucket: "inundaqro.firebasestorage.app",
  messagingSenderId: "1077541168606",
  appId: "1:1077541168606:web:07f1770c95627c5c40e94f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;