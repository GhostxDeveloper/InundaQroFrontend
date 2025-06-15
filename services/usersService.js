import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export async function registerUser({ nombre, email, password }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: nombre });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
