import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_URL = 'https://apicallrest.onrender.com/api';
const API_URL = 'http://192.168.1.73:3004/api';

export async function verifyAndRegisterUser({ nombre, email, telefono, password, code }) {
  try {
    const res = await fetch(`${API_URL}/verify-and-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, telefono, password, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al registrar usuario');
    }

    return { success: true, id: data.id };
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

export async function sendVerificationCodeApi({ email, code }) {
  const res = await fetch(`${API_URL}/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: email, code }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al enviar código');
  }
}

export async function sendForgotPasswordCodeApi(email) {
  try {
    const res = await fetch(`${API_URL}/send-code-reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Error al enviar código');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function resetPasswordApi({ email, code, newPassword }) {
  try {
    const res = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al cambiar la contraseña');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}