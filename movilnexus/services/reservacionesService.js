import { apiFetch } from './api';

export const reservacionesService = {
  /**
   * Obtener todas las reservaciones del usuario
   * @param {object} filters - {page, per_page, status, sort_by}
   * @returns {Promise<{reservaciones: array, total: number}>}
   */
  async listReservaciones(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await apiFetch(`/reservaciones${query}`);
      return response;
    } catch (error) {
      throw new Error(`Error listando reservaciones: ${error.message}`);
    }
  },

  /**
   * Obtener detalles de una reservación específica
   * @param {number} reservacionId - ID de la reservación
   * @returns {Promise<object>}
   */
  async getReservacionDetails(reservacionId) {
    try {
      const response = await apiFetch(`/reservaciones/${reservacionId}`);
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo detalles de reservación: ${error.message}`);
    }
  },

  /**
   * Crear nueva reservación
   * @param {object} reservacionData - {espacio_id, start_date, end_date, cantidad_personas, notas}
   * @returns {Promise<object>}
   */
  async createReservacion(reservacionData) {
    try {
      const response = await apiFetch('/reservaciones', {
        method: 'POST',
        body: JSON.stringify(reservacionData),
      });
      return response;
    } catch (error) {
      throw new Error(`Error creando reservación: ${error.message}`);
    }
  },

  /**
   * Actualizar reservación existente
   * @param {number} reservacionId - ID de la reservación
   * @param {object} reservacionData - Datos a actualizar
   * @returns {Promise<object>}
   */
  async updateReservacion(reservacionId, reservacionData) {
    try {
      const response = await apiFetch(`/reservaciones/${reservacionId}`, {
        method: 'PUT',
        body: JSON.stringify(reservacionData),
      });
      return response;
    } catch (error) {
      throw new Error(`Error actualizando reservación: ${error.message}`);
    }
  },

  /**
   * Cancelar reservación
   * @param {number} reservacionId - ID de la reservación
   * @param {string} motivo - Motivo de cancelación (opcional)
   * @returns {Promise<object>}
   */
  async cancelReservacion(reservacionId, motivo = '') {
    try {
      const response = await apiFetch(`/reservaciones/${reservacionId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ motivo }),
      });
      return response;
    } catch (error) {
      throw new Error(`Error cancelando reservación: ${error.message}`);
    }
  },

  /**
   * Confirmar reservación
   * @param {number} reservacionId - ID de la reservación
   * @returns {Promise<object>}
   */
  async confirmReservacion(reservacionId) {
    try {
      const response = await apiFetch(
        `/reservaciones/${reservacionId}/confirm`,
        { method: 'POST' }
      );
      return response;
    } catch (error) {
      throw new Error(`Error confirmando reservación: ${error.message}`);
    }
  },

  /**
   * Rechazar reservación (solo anfitrión)
   * @param {number} reservacionId - ID de la reservación
   * @param {string} motivo - Motivo del rechazo (opcional)
   * @returns {Promise<object>}
   */
  async rejectReservacion(reservacionId, motivo = '') {
    try {
      const response = await apiFetch(
        `/reservaciones/${reservacionId}/reject`,
        {
          method: 'POST',
          body: JSON.stringify({ motivo }),
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Error rechazando reservación: ${error.message}`);
    }
  },

  /**
   * Obtener reservaciones pendientes (solo anfitrión)
   * @param {number} page - Número de página
   * @param {number} perPage - Resultados por página
   * @returns {Promise<object>}
   */
  async getPendingReservaciones(page = 1, perPage = 10) {
    try {
      const response = await apiFetch(
        `/reservaciones/pending?page=${page}&per_page=${perPage}`
      );
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo reservaciones pendientes: ${error.message}`);
    }
  },

  /**
   * Obtener historial de reservaciones
   * @param {number} page - Número de página
   * @param {number} perPage - Resultados por página
   * @returns {Promise<object>}
   */
  async getReservacionHistory(page = 1, perPage = 10) {
    try {
      const response = await apiFetch(
        `/reservaciones/history?page=${page}&per_page=${perPage}`
      );
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo historial: ${error.message}`);
    }
  },

  /**
   * Obtener estadísticas de reservaciones del usuario
   * @returns {Promise<object>}
   */
  async getReservacionStats() {
    try {
      const response = await apiFetch('/reservaciones/stats');
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  },

  /**
   * Agregar reseña a una reservación completada
   * @param {number} reservacionId - ID de la reservación
   * @param {object} reviewData - {rating, comentario}
   * @returns {Promise<object>}
   */
  async addReview(reservacionId, reviewData) {
    try {
      const response = await apiFetch(
        `/reservaciones/${reservacionId}/review`,
        {
          method: 'POST',
          body: JSON.stringify(reviewData),
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Error agregando reseña: ${error.message}`);
    }
  },

  /**
   * Obtener disponibilidad de un espacio
   * @param {number} espacioId - ID del espacio
   * @param {string} startDate - Fecha inicio (YYYY-MM-DD)
   * @param {string} endDate - Fecha fin (YYYY-MM-DD)
   * @returns {Promise<boolean>}
   */
  async checkEspacioAvailability(espacioId, startDate, endDate) {
    try {
      const response = await apiFetch(
        `/espacios/${espacioId}/availability/check`,
        {
          method: 'POST',
          body: JSON.stringify({ start_date: startDate, end_date: endDate }),
        }
      );
      return response.available || false;
    } catch (error) {
      throw new Error(`Error verificando disponibilidad: ${error.message}`);
    }
  },

  /**
   * Cancelar múltiples reservaciones
   * @param {array} reservacionIds - IDs de reservaciones a cancelar
   * @returns {Promise<object>}
   */
  async bulkCancelReservaciones(reservacionIds) {
    try {
      const response = await apiFetch('/reservaciones/bulk-cancel', {
        method: 'POST',
        body: JSON.stringify({ ids: reservacionIds }),
      });
      return response;
    } catch (error) {
      throw new Error(`Error cancelando múltiples reservaciones: ${error.message}`);
    }
  },
};
