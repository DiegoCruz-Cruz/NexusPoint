import { apiFetch } from './api';

export const notificacionesService = {
  /**
   * Obtener todas las notificaciones del usuario
   * @param {object} filters - {page, per_page, tipo, leido, sort_by}
   * @returns {Promise<{notificaciones: array, total: number}>}
   */
  async listNotificaciones(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await apiFetch(`/notificaciones${query}`);
      return response;
    } catch (error) {
      throw new Error(`Error listando notificaciones: ${error.message}`);
    }
  },

  /**
   * Obtener detalles de una notificación específica
   * @param {number} notificacionId - ID de la notificación
   * @returns {Promise<object>}
   */
  async getNotificacionDetails(notificacionId) {
    try {
      const response = await apiFetch(`/notificaciones/${notificacionId}`);
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo detalles de notificación: ${error.message}`);
    }
  },

  /**
   * Marcar notificación como leída
   * @param {number} notificacionId - ID de la notificación
   * @returns {Promise<object>}
   */
  async markAsRead(notificacionId) {
    try {
      const response = await apiFetch(
        `/notificaciones/${notificacionId}/read`,
        { method: 'POST' }
      );
      return response;
    } catch (error) {
      throw new Error(`Error marcando notificación como leída: ${error.message}`);
    }
  },

  /**
   * Marcar todas las notificaciones como leídas
   * @returns {Promise<object>}
   */
  async markAllAsRead() {
    try {
      const response = await apiFetch('/notificaciones/read-all', {
        method: 'POST',
      });
      return response;
    } catch (error) {
      throw new Error(`Error marcando todas como leídas: ${error.message}`);
    }
  },

  /**
   * Marcar notificación como no leída
   * @param {number} notificacionId - ID de la notificación
   * @returns {Promise<object>}
   */
  async markAsUnread(notificacionId) {
    try {
      const response = await apiFetch(
        `/notificaciones/${notificacionId}/unread`,
        { method: 'POST' }
      );
      return response;
    } catch (error) {
      throw new Error(`Error marcando notificación como no leída: ${error.message}`);
    }
  },

  /**
   * Eliminar una notificación
   * @param {number} notificacionId - ID de la notificación
   * @returns {Promise<void>}
   */
  async deleteNotificacion(notificacionId) {
    try {
      await apiFetch(`/notificaciones/${notificacionId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      throw new Error(`Error eliminando notificación: ${error.message}`);
    }
  },

  /**
   * Eliminar todas las notificaciones
   * @returns {Promise<object>}
   */
  async deleteAllNotificaciones() {
    try {
      const response = await apiFetch('/notificaciones/delete-all', {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(`Error eliminando todas las notificaciones: ${error.message}`);
    }
  },

  /**
   * Obtener conteo de notificaciones sin leer
   * @returns {Promise<{count: number}>}
   */
  async getUnreadCount() {
    try {
      const response = await apiFetch('/notificaciones/unread-count');
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo conteo sin leer: ${error.message}`);
    }
  },

  /**
   * Obtener notificaciones recientes
   * @param {number} limit - Cantidad de notificaciones
   * @returns {Promise<array>}
   */
  async getRecentNotificaciones(limit = 10) {
    try {
      const response = await apiFetch(`/notificaciones/recent?limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo notificaciones recientes: ${error.message}`);
    }
  },

  /**
   * Obtener notificaciones sin leer
   * @param {number} limit - Cantidad de notificaciones
   * @returns {Promise<array>}
   */
  async getUnreadNotificaciones(limit = 20) {
    try {
      const response = await apiFetch(`/notificaciones/unread?limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo notificaciones sin leer: ${error.message}`);
    }
  },

  /**
   * Obtener notificaciones por tipo
   * @param {string} tipo - Tipo de notificación (reservacion, mensaje, sistema, etc)
   * @param {object} filters - Filtros adicionales
   * @returns {Promise<array>}
   */
  async getNotificacionesByType(tipo, filters = {}) {
    try {
      const params = new URLSearchParams({ tipo, ...filters });
      const response = await apiFetch(
        `/notificaciones/type?${params.toString()}`
      );
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo notificaciones por tipo: ${error.message}`);
    }
  },

  /**
   * Obtener preferencias de notificaciones
   * @returns {Promise<object>}
   */
  async getNotificationPreferences() {
    try {
      const response = await apiFetch('/notification-preferences');
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo preferencias: ${error.message}`);
    }
  },

  /**
   * Actualizar preferencias de notificaciones
   * @param {object} preferences - Preferencias a actualizar
   * @returns {Promise<object>}
   */
  async updateNotificationPreferences(preferences) {
    try {
      const response = await apiFetch('/notification-preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      return response;
    } catch (error) {
      throw new Error(`Error actualizando preferencias: ${error.message}`);
    }
  },

  /**
   * Habilitar notificaciones por push
   * @param {string} token - Token de device para push notifications
   * @returns {Promise<object>}
   */
  async enablePushNotifications(token) {
    try {
      const response = await apiFetch('/notifications/push/enable', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      return response;
    } catch (error) {
      throw new Error(`Error habilitando notificaciones push: ${error.message}`);
    }
  },

  /**
   * Deshabilitar notificaciones por push
   * @returns {Promise<void>}
   */
  async disablePushNotifications() {
    try {
      await apiFetch('/notifications/push/disable', { method: 'POST' });
    } catch (error) {
      throw new Error(`Error deshabilitando notificaciones push: ${error.message}`);
    }
  },

  /**
   * Buscar notificaciones
   * @param {string} searchTerm - Término de búsqueda
   * @param {object} filters - Filtros adicionales
   * @returns {Promise<array>}
   */
  async searchNotificaciones(searchTerm, filters = {}) {
    try {
      const response = await apiFetch('/notificaciones/search', {
        method: 'POST',
        body: JSON.stringify({ query: searchTerm, ...filters }),
      });
      return response;
    } catch (error) {
      throw new Error(`Error en búsqueda de notificaciones: ${error.message}`);
    }
  },

  /**
   * Obtener estadísticas de notificaciones
   * @returns {Promise<object>}
   */
  async getNotificationStats() {
    try {
      const response = await apiFetch('/notificaciones/stats');
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  },

  /**
   * Archivar notificación
   * @param {number} notificacionId - ID de la notificación
   * @returns {Promise<object>}
   */
  async archiveNotificacion(notificacionId) {
    try {
      const response = await apiFetch(
        `/notificaciones/${notificacionId}/archive`,
        { method: 'POST' }
      );
      return response;
    } catch (error) {
      throw new Error(`Error archivando notificación: ${error.message}`);
    }
  },

  /**
   * Obtener notificaciones archivadas
   * @param {object} filters - {page, per_page}
   * @returns {Promise<{notificaciones: array, total: number}>}
   */
  async getArchivedNotificaciones(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await apiFetch(`/notificaciones/archived${query}`);
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo notificaciones archivadas: ${error.message}`);
    }
  },
};
