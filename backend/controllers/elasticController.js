const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

// Configuration du client Elasticsearch
const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || '',
    password: process.env.ELASTICSEARCH_PASSWORD || ''
  }
});

// Vérifier la santé du cluster Elasticsearch
const checkHealth = async (req, res) => {
  try {
    const health = await elasticClient.cluster.health();
    res.json(health);
  } catch (error) {
    console.error('Erreur lors de la vérification de santé:', error);
    res.status(500).json({ error: 'Impossible de vérifier la santé du cluster' });
  }
};

// Créer un index
const createIndex = async (req, res) => {
  const { indexName } = req.params;
  
  try {
    const indexExists = await elasticClient.indices.exists({ index: indexName });
    
    if (indexExists) {
      return res.status(400).json({ error: `L'index ${indexName} existe déjà` });
    }
    
    const response = await elasticClient.indices.create({ index: indexName });
    res.status(201).json(response);
  } catch (error) {
    console.error(`Erreur lors de la création de l'index ${indexName}:`, error);
    res.status(500).json({ error: `Impossible de créer l'index ${indexName}` });
  }
};

// Supprimer un index
const deleteIndex = async (req, res) => {
  const { indexName } = req.params;
  
  try {
    const indexExists = await elasticClient.indices.exists({ index: indexName });
    
    if (!indexExists) {
      return res.status(404).json({ error: `L'index ${indexName} n'existe pas` });
    }
    
    const response = await elasticClient.indices.delete({ index: indexName });
    res.json(response);
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'index ${indexName}:`, error);
    res.status(500).json({ error: `Impossible de supprimer l'index ${indexName}` });
  }
};

// Obtenir tous les index
const getAllIndices = async (req, res) => {
  try {
    const response = await elasticClient.cat.indices({ format: 'json' });
    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des index:', error);
    res.status(500).json({ error: 'Impossible de récupérer les index' });
  }
};

// Recherche de base dans un index
const searchInIndex = async (req, res) => {
  const { indexName } = req.params;
  const { query } = req.body;
  
  try {
    const indexExists = await elasticClient.indices.exists({ index: indexName });
    
    if (!indexExists) {
      return res.status(404).json({ error: `L'index ${indexName} n'existe pas` });
    }
    
    const response = await elasticClient.search({
      index: indexName,
      body: query
    });
    
    res.json(response);
  } catch (error) {
    console.error(`Erreur lors de la recherche dans l'index ${indexName}:`, error);
    res.status(500).json({ error: `Impossible de rechercher dans l'index ${indexName}` });
  }
};

// Indexer un document
const indexDocument = async (req, res) => {
  const { indexName } = req.params;
  const { id, document } = req.body;
  
  if (!document) {
    return res.status(400).json({ error: 'Le document est requis' });
  }
  
  try {
    const indexExists = await elasticClient.indices.exists({ index: indexName });
    
    if (!indexExists) {
      return res.status(404).json({ error: `L'index ${indexName} n'existe pas` });
    }
    
    let response;
    
    if (id) {
      // Indexation avec un ID spécifié
      response = await elasticClient.index({
        index: indexName,
        id: id,
        document: document
      });
    } else {
      // Indexation avec un ID généré automatiquement
      response = await elasticClient.index({
        index: indexName,
        document: document
      });
    }
    
    res.status(201).json(response);
  } catch (error) {
    console.error(`Erreur lors de l'indexation du document dans ${indexName}:`, error);
    res.status(500).json({ error: `Impossible d'indexer le document` });
  }
};

// Récupérer un document par ID
const getDocument = async (req, res) => {
  const { indexName, id } = req.params;
  
  try {
    const indexExists = await elasticClient.indices.exists({ index: indexName });
    
    if (!indexExists) {
      return res.status(404).json({ error: `L'index ${indexName} n'existe pas` });
    }
    
    const documentExists = await elasticClient.exists({
      index: indexName,
      id: id
    });
    
    if (!documentExists) {
      return res.status(404).json({ error: `Le document avec l'ID ${id} n'existe pas` });
    }
    
    const response = await elasticClient.get({
      index: indexName,
      id: id
    });
    
    res.json(response);
  } catch (error) {
    console.error(`Erreur lors de la récupération du document ${id} dans ${indexName}:`, error);
    res.status(500).json({ error: `Impossible de récupérer le document ${id}` });
  }
};

// Supprimer un document
const deleteDocument = async (req, res) => {
  const { indexName, id } = req.params;
  
  try {
    const indexExists = await elasticClient.indices.exists({ index: indexName });
    
    if (!indexExists) {
      return res.status(404).json({ error: `L'index ${indexName} n'existe pas` });
    }
    
    const documentExists = await elasticClient.exists({
      index: indexName,
      id: id
    });
    
    if (!documentExists) {
      return res.status(404).json({ error: `Le document avec l'ID ${id} n'existe pas` });
    }
    
    const response = await elasticClient.delete({
      index: indexName,
      id: id
    });
    
    res.json(response);
  } catch (error) {
    console.error(`Erreur lors de la suppression du document ${id} dans ${indexName}:`, error);
    res.status(500).json({ error: `Impossible de supprimer le document ${id}` });
  }
};

module.exports = {
  elasticClient,
  checkHealth,
  createIndex,
  deleteIndex,
  getAllIndices,
  searchInIndex,
  indexDocument,
  getDocument,
  deleteDocument
}; 