import React, { useState, useEffect } from 'react';
import elasticService from '../services/api';

const Search = () => {
  const [indices, setIndices] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger la liste des index
  useEffect(() => {
    const fetchIndices = async () => {
      try {
        setIsLoading(true);
        const indicesData = await elasticService.getAllIndices();
        setIndices(indicesData);
        if (indicesData.length > 0) {
          setSelectedIndex(indicesData[0].index);
        }
      } catch (err) {
        setError('Impossible de récupérer la liste des index');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndices();
  }, []);

  // Effectuer une recherche
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedIndex) {
      setError('Veuillez sélectionner un index');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Création de la requête Elasticsearch
      const query = {
        query: {
          query_string: {
            query: searchQuery || '*' // Si vide, recherche tout
          }
        }
      };

      const results = await elasticService.searchInIndex(selectedIndex, query);
      setSearchResults(results);
    } catch (err) {
      setError(`Erreur lors de la recherche: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Recherche Elasticsearch</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-header">Paramètres de recherche</div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="mb-3">
              <label htmlFor="indexSelect" className="form-label">Sélectionner un index</label>
              <select
                id="indexSelect"
                className="form-select"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                disabled={indices.length === 0}
                required
              >
                {indices.length === 0 ? (
                  <option value="">Aucun index disponible</option>
                ) : (
                  indices.map(index => (
                    <option key={index.index} value={index.index}>
                      {index.index}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="searchQuery" className="form-label">Requête de recherche</label>
              <input
                type="text"
                className="form-control"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Entrez votre requête (ex: field:value)"
              />
              <div className="form-text">
                Laissez vide pour rechercher tous les documents
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !selectedIndex}
            >
              {isLoading ? 'Recherche en cours...' : 'Rechercher'}
            </button>
          </form>
        </div>
      </div>

      {searchResults && (
        <div className="card">
          <div className="card-header">
            Résultats ({searchResults.hits?.total?.value || 0} documents trouvés)
          </div>
          <div className="card-body">
            {searchResults.hits?.hits?.length === 0 ? (
              <p>Aucun résultat trouvé</p>
            ) : (
              <div>
                {searchResults.hits.hits.map((hit, index) => (
                  <div key={hit._id} className="mb-3 p-3 border rounded">
                    <h5>Document {index + 1}</h5>
                    <p><strong>ID:</strong> {hit._id}</p>
                    <p><strong>Score:</strong> {hit._score}</p>
                    <div>
                      <strong>Contenu:</strong>
                      <pre className="mt-2 p-2 bg-light">
                        {JSON.stringify(hit._source, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search; 