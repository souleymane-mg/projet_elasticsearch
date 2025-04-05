import axios from 'axios';

const API_URL = 'http://localhost:5000/api/elastic';

// Création d'une instance axios
const api = axios.create({
  baseURL: API_URL
});

// Service pour les opérations Elasticsearch
const elasticService = {
  // Vérifier la santé du cluster
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de la santé:', error);
      throw error;
    }
  },

  // Obtenir tous les index
  getAllIndices: async () => {
    try {
      const response = await api.get('/indices');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des index:', error);
      throw error;
    }
  },

  // Créer un nouvel index
  createIndex: async (indexName) => {
    try {
      const response = await api.post(`/indices/${indexName}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la création de l'index ${indexName}:`, error);
      throw error;
    }
  },

  // Supprimer un index
  deleteIndex: async (indexName) => {
    try {
      const response = await api.delete(`/indices/${indexName}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'index ${indexName}:`, error);
      throw error;
    }
  },

  // Rechercher dans un index
  searchInIndex: async (indexName, query) => {
    try {
      const response = await api.post(`/search/${indexName}`, { query });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la recherche dans l'index ${indexName}:`, error);
      throw error;
    }
  },

  // Indexer un document
  indexDocument: async (indexName, document, id = null) => {
    try {
      const payload = { document };
      if (id) {
        payload.id = id;
      }
      
      const response = await api.post(`/indices/${indexName}/document`, payload);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'indexation du document dans ${indexName}:`, error);
      throw error;
    }
  },

  // Récupérer un document par ID
  getDocument: async (indexName, id) => {
    try {
      const response = await api.get(`/indices/${indexName}/document/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du document ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un document
  deleteDocument: async (indexName, id) => {
    try {
      const response = await api.delete(`/indices/${indexName}/document/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du document ${id}:`, error);
      throw error;
    }
  }
};

export default elasticService; 