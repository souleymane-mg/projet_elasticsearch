const express = require('express');
const cors = require('cors');
const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const elasticRoutes = require('./routes/elasticRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Elasticsearch client
const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || '',
    password: process.env.ELASTICSEARCH_PASSWORD || ''
  }
});

// Test route
app.get('/', async (req, res) => {
  res.send('API fonctionne correctement');
});

// Vérification de la connexion à Elasticsearch
app.get('/api/elastic-health', async (req, res) => {
  try {
    const health = await elasticClient.cluster.health();
    res.json(health);
  } catch (error) {
    console.error('Erreur Elasticsearch:', error);
    res.status(500).json({ error: 'Impossible de se connecter à Elasticsearch' });
  }
});

// Routes API
app.use('/api/elastic', elasticRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
}); 