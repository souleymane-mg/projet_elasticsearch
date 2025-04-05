import React, { useState, useEffect } from 'react';
import elasticService from '../services/api';

const Home = () => {
  const [clusterHealth, setClusterHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClusterHealth = async () => {
      try {
        setIsLoading(true);
        const health = await elasticService.checkHealth();
        setClusterHealth(health);
        setError(null);
      } catch (err) {
        setError('Impossible de se connecter à Elasticsearch');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClusterHealth();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Application Elasticsearch</h1>
      
      <div className="card mb-4">
        <div className="card-header">
          État du cluster Elasticsearch
        </div>
        <div className="card-body">
          {isLoading ? (
            <p>Chargement de l'état du cluster...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : clusterHealth ? (
            <div>
              <p><strong>Status:</strong> {clusterHealth.status}</p>
              <p><strong>Nombre de nœuds:</strong> {clusterHealth.number_of_nodes}</p>
              <p><strong>Nombre d'index:</strong> {clusterHealth.active_primary_shards}</p>
            </div>
          ) : (
            <p>Aucune information disponible</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Fonctionnalités disponibles</div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item">Gestion des index</li>
                <li className="list-group-item">Indexation de documents</li>
                <li className="list-group-item">Recherche simple et avancée</li>
                <li className="list-group-item">Analyse des données</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">À propos</div>
            <div className="card-body">
              <p>
                Cette application vous permet d'interagir avec Elasticsearch pour gérer les index,
                indexer des documents et effectuer des recherches complexes.
              </p>
              <p>
                Utilisez le menu de navigation pour accéder aux différentes fonctionnalités.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 