import { apiFetch } from './api';

export const espaciosService = {
  /**
   * Obtener lista de espacios con filtros opcionales
   * @param {object} filters - {page, per_page, search, tipo, ubicacion}
   * @returns {Promise<{spaces: array, total: number}>}
   */
  async listEspacios(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      const query = params.toString() ? `?${params.toString()}` : '';
      const response = await apiFetch(`/espacios${query}`);
      return response;
    } catch (error) {
      throw new Error(`Error listando espacios: ${error.message}`);
    }
  },

  /**
   * Obtener detalles de un espacio específico
   * @param {number} espacioId - ID del espacio
   * @returns {Promise<object>}
   */
  async getEspacioDetails(espacioId) {
    try {
      const response = await apiFetch(`/espacios/${espacioId}`);
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo detalles del espacio: ${error.message}`);
    }
  },

  /**
   * Crear nuevo espacio
   * @param {object} espacioData - Datos del espacio
   * @returns {Promise<object>}
   */
  async createEspacio(espacioData) {
    try {
      const response = await apiFetch('/espacios', {
        method: 'POST',
        body: JSON.stringify(espacioData),
      });
      return response;
    } catch (error) {
      throw new Error(`Error creando espacio: ${error.message}`);
    }
  },

  /**
   * Actualizar espacio existente
   * @param {number} espacioId - ID del espacio
   * @param {object} espacioData - Datos a actualizar
   * @returns {Promise<object>}
   */
  async updateEspacio(espacioId, espacioData) {
    try {
      const response = await apiFetch(`/espacios/${espacioId}`, {
        method: 'PUT',
        body: JSON.stringify(espacioData),
      });
      return response;
    } catch (error) {
      throw new Error(`Error actualizando espacio: ${error.message}`);
    }
  },

  /**
   * Eliminar espacio
   * @param {number} espacioId - ID del espacio
   * @returns {Promise<void>}
   */
  async deleteEspacio(espacioId) {
    try {
      await apiFetch(`/espacios/${espacioId}`, { method: 'DELETE' });
    } catch (error) {
      throw new Error(`Error eliminando espacio: ${error.message}`);
    }
  },

  /**
   * Obtener espacios del usuario con paginación
   * @param {number} page - Número de página
   * @param {number} perPage - Resultados por página
   * @returns {Promise<object>}
   */
  async getUserEspacios(page = 1, perPage = 10) {
    try {
      const response = await apiFetch(
        `/my-espacios?page=${page}&per_page=${perPage}`
      );
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo mis espacios: ${error.message}`);
    }
  },

  /**
   * Buscar espacios por criterios
   * @param {string} searchTerm - Término de búsqueda
   * @param {object} filters - Filtros adicionales
   * @returns {Promise<array>}
   */
  async searchEspacios(searchTerm, filters = {}) {
    try {
      const response = await apiFetch('/espacios/search', {
        method: 'POST',
        body: JSON.stringify({ query: searchTerm, ...filters }),
      });
      return response;
    } catch (error) {
      throw new Error(`Error en búsqueda de espacios: ${error.message}`);
    }
  },

  /**
   * Obtener disponibilidad de un espacio
   * @param {number} espacioId - ID del espacio
   * @param {string} startDate - Fecha inicio (YYYY-MM-DD)
   * @param {string} endDate - Fecha fin (YYYY-MM-DD)
   * @returns {Promise<object>}
   */
  async checkAvailability(espacioId, startDate, endDate) {
    try {
      const response = await apiFetch(
        `/espacios/${espacioId}/availability`,
        {
          method: 'POST',
          body: JSON.stringify({ start_date: startDate, end_date: endDate }),
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Error verificando disponibilidad: ${error.message}`);
    }
  },

  /**
   * Obtener espacios destacados/populares
   * @param {number} limit - Cantidad de resultados
   * @returns {Promise<array>}
   */
  async getFeaturedEspacios(limit = 5) {
    try {
      const response = await apiFetch(`/espacios/featured?limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error(`Error obteniendo espacios destacados: ${error.message}`);
    }
  },
};
