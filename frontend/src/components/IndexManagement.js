import React, { useState, useEffect } from 'react';
import elasticService from '../services/api';

const IndexManagement = () => {
  const [indices, setIndices] = useState([]);
  const [newIndexName, setNewIndexName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Charger la liste des index
  const fetchIndices = async () => {
    try {
      setIsLoading(true);
      const indicesData = await elasticService.getAllIndices();
      setIndices(indicesData);
      setError(null);
    } catch (err) {
      setError('Impossible de récupérer la liste des index');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIndices();
  }, []);

  // Créer un nouvel index
  const handleCreateIndex = async (e) => {
    e.preventDefault();
    if (!newIndexName.trim()) {
      setError('Veuillez entrer un nom d\'index valide');
      return;
    }

    try {
      setIsLoading(true);
      await elasticService.createIndex(newIndexName);
      setNewIndexName('');
      setSuccessMessage(`Index "${newIndexName}" créé avec succès`);
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchIndices(); // Rafraîchir la liste
    } catch (err) {
      setError(`Impossible de créer l'index "${newIndexName}"`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un index
  const handleDeleteIndex = async (indexName) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'index "${indexName}" ?`)) {
      return;
    }

    try {
      setIsLoading(true);
      await elasticService.deleteIndex(indexName);
      setSuccessMessage(`Index "${indexName}" supprimé avec succès`);
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchIndices(); // Rafraîchir la liste
    } catch (err) {
      setError(`Impossible de supprimer l'index "${indexName}"`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gestion des Index</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="card mb-4">
        <div className="card-header">Créer un nouvel index</div>
        <div className="card-body">
          <form onSubmit={handleCreateIndex}>
            <div className="mb-3">
              <label htmlFor="indexName" className="form-label">Nom de l'index</label>
              <input
                type="text"
                className="form-control"
                id="indexName"
                value={newIndexName}
                onChange={(e) => setNewIndexName(e.target.value)}
                placeholder="Entrez le nom de l'index"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer un index'}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Liste des index</div>
        <div className="card-body">
          {isLoading ? (
            <p>Chargement des index...</p>
          ) : indices.length === 0 ? (
            <p>Aucun index trouvé</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Documents</th>
                  <th>Taille</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {indices.map((index) => (
                  <tr key={index.index}>
                    <td>{index.index}</td>
                    <td>{index.docs?.count || 0}</td>
                    <td>{index.store?.size || '0kb'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteIndex(index.index)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexManagement; 