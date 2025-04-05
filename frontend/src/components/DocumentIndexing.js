import React, { useState, useEffect } from 'react';
import elasticService from '../services/api';

const DocumentIndexing = () => {
  const [indices, setIndices] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Gérer l'indexation du document
  const handleIndexDocument = async (e) => {
    e.preventDefault();
    
    if (!selectedIndex) {
      setError('Veuillez sélectionner un index');
      return;
    }
    
    if (!documentContent) {
      setError('Veuillez saisir le contenu du document');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Essayer de parser le contenu JSON
      let documentData;
      try {
        documentData = JSON.parse(documentContent);
      } catch (err) {
        setError('Le contenu du document doit être au format JSON valide');
        setIsLoading(false);
        return;
      }
      
      // Appel d'API pour indexer le document
      const id = documentId.trim() || null;
      await elasticService.indexDocument(selectedIndex, documentData, id);
      
      setSuccessMessage('Document indexé avec succès');
      setDocumentId('');
      setDocumentContent('');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      setError(`Erreur lors de l'indexation du document: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Indexation de Documents</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <div className="card">
        <div className="card-header">Ajouter un document</div>
        <div className="card-body">
          <form onSubmit={handleIndexDocument}>
            <div className="mb-3">
              <label htmlFor="indexSelect" className="form-label">Index cible</label>
              <select
                id="indexSelect"
                className="form-select"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                disabled={indices.length === 0 || isLoading}
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
              <label htmlFor="documentId" className="form-label">ID du document (optionnel)</label>
              <input
                type="text"
                className="form-control"
                id="documentId"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Laissez vide pour un ID automatique"
                disabled={isLoading}
              />
              <div className="form-text">
                Si laissé vide, Elasticsearch générera un ID automatiquement
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="documentContent" className="form-label">Contenu du document (JSON)</label>
              <textarea
                className="form-control"
                id="documentContent"
                rows="10"
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                placeholder='{"field1": "value1", "field2": "value2"}'
                required
                disabled={isLoading}
              ></textarea>
              <div className="form-text">
                Le contenu doit être au format JSON valide
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !selectedIndex}
            >
              {isLoading ? 'Indexation en cours...' : 'Indexer le document'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentIndexing; 