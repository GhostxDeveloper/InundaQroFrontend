import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

// Fallback para aleatoriedad en React Native/Expo
bcrypt.setRandomFallback((len) => {
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
});

export async function registerUser({ nombre, email, password }) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await addDoc(collection(db, "users"), {
      nombre,
      email,
      password: hashedPassword,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function loginUser({ email, password }) {
  try {
    // Busca el usuario por email
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Solo debería haber un usuario por email
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Compara la contraseña ingresada con el hash guardado
    const passwordMatch = bcrypt.compareSync(password, userData.password);

    if (!passwordMatch) {
      return { success: false, error: "Contraseña incorrecta" };
    }

    // Puedes retornar los datos del usuario si quieres
    return { success: true, user: { id: userDoc.id, ...userData } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
