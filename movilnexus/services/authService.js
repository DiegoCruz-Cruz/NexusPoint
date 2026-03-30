import { apiFetch } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    try {
      const response = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  },

  /**
   * Registro de nuevo usuario
   * @param {object} userData - Datos del usuario {name, email, password, password_confirmation}
   * @returns {Promise<object>}
   */
  async register(userData) {
    try {
      const response = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(`Error en registro: ${error.message}`);
    }
  },

  /**
   * Cerrar sesión
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await apiFetch('/logout', { method: 'POST' });
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar datos localmente incluso si falla la petición
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
  },

  /**
   * Solicitar recuperación de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<object>}
   */
  async requestPasswordReset(email) {
    try {
      const response = await apiFetch('/password-reset-request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      throw new Error(`Error al solicitar reset: ${error.message}`);
    }
  },

  /**
   * Completar recuperación de contraseña
   * @param {object} data - {email, token, password, password_confirmation}
   * @returns {Promise<object>}
   */
  async resetPassword(data) {
    try {
      const response = await apiFetch('/password-reset', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      throw new Error(`Error al resetear contraseña: ${error.message}`);
    }
  },

  /**
   * Obtener usuario actual
   * @returns {Promise<object>}
   */
  async getCurrentUser() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },

  /**
   * Verificar si hay sesión activa
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  },

  /**
   * Actualizar perfil de usuario
   * @param {object} userData - Datos a actualizar
   * @returns {Promise<object>}
   */
  async updateProfile(userData) {
    try {
      const response = await apiFetch('/profile/update', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      if (response.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw new Error(`Error actualizando perfil: ${error.message}`);
    }
  },
};
