const express = require('express');
const router = express.Router();
const elasticController = require('../controllers/elasticController');

// Route pour vérifier la santé du cluster
router.get('/health', elasticController.checkHealth);

// Routes pour la gestion des index
router.get('/indices', elasticController.getAllIndices);
router.post('/indices/:indexName', elasticController.createIndex);
router.delete('/indices/:indexName', elasticController.deleteIndex);

// Routes pour la gestion des documents
router.post('/indices/:indexName/document', elasticController.indexDocument);
router.get('/indices/:indexName/document/:id', elasticController.getDocument);
router.delete('/indices/:indexName/document/:id', elasticController.deleteDocument);

// Route pour la recherche
router.post('/search/:indexName', elasticController.searchInIndex);

module.exports = router; 