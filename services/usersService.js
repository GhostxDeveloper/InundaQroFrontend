import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://apicallrest.onrender.com/api';

export async function registerUser({ nombre, email, password }) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al registrar usuario');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function loginUser({ email, password }) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.userData));

    // Retorna token y userData para usar en contexto
    return { success: true, token: data.token, userData: data.userData };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function logoutUser() {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
}
