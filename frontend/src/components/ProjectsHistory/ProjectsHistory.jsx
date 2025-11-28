import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ApiService from "../../utils/ApiService";
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import "./ProjectsHistory.css";

const ProjectsHistory = () => {
  const [optimizationHistory, setOptimizationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Historique | OptimCut";
    const fetchOptimizationHistory = async () => {
      try {
        const response = await ApiService.getHistory();
        let historyData = response.history;

        let historyArray = Array.isArray(historyData) 
          ? historyData 
          : Object.values(historyData || {});

        historyArray = historyArray
          .filter(item => item?.projectName && item?.timestamp)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setOptimizationHistory(historyArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique", error);
        setIsLoading(false);
      }
    };

    fetchOptimizationHistory();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      try {
        console.log("Suppression de l'ID :", id);
        await ApiService.deleteOptimizationHistory(id);
        setOptimizationHistory(prevHistory => prevHistory.filter(item => item.id !== id));
        console.log("Suppression réussie pour l'ID :", id);
      } catch (error) {
        console.error("Erreur détaillée lors de la suppression :", error);
        alert("Une erreur est survenue lors de la suppression : " + error.message);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="projects-history">
      <h2>Historique des Optimisations</h2>
      {optimizationHistory.length > 0 ? (
        <div className="projects-list2">
          {optimizationHistory.map((item) => (
            <div key={item.id} className="project-card">
              <h3>Nom du projet : {item.projectName}</h3>
              <p>Date du projet: {new Date(item.timestamp).toLocaleString()}</p>
              <NavLink 
                to={`/dashboard/projects/${item.id}`} 
                className="detaillink"
              >
                Voir les détails
              </NavLink>
              <button
                onClick={() => handleDelete(item.id)}
                className="delete-button"
                title="Supprimer" // Texte d'infobulle pour accessibilité
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-projects">Aucune optimisation enregistrée.</p>
      )}
    </div>
  );
};

export default ProjectsHistory;