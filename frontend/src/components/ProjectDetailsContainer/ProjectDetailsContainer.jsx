import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ApiService from '../../utils/ApiService';
import './ProjectDetailsContainer.css';

const ProjectDetailsContainer = () => {
  const { optimizationId } = useParams();
  const [optimization, setOptimization] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptimization = async () => {
      try {
        const response = await ApiService.get("/api/history");
        console.log("API Response:", response); 
        
        // Extract array from response.history
        const optimizations = response.history;
        
        if (!optimizations || !Array.isArray(optimizations)) {
          setError("Données d'historique invalides");
          return;
        }

        // Find optimization by ID in the array
        const foundOptimization = optimizations.find(
          (opt) => opt.id === optimizationId
        );

        if (foundOptimization) {
          setOptimization(foundOptimization);
        } else {
          setError("Optimisation non trouvée");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Échec du chargement des données");
      }
    };

    fetchOptimization();
  }, [optimizationId]);

  if (error) return <div>Erreur : {error}</div>;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (optimization) {
      setIsLoading(false);
    }
  }, [optimization]);

  if (isLoading || !optimization) {
    return <LoadingSpinner />;
  }


  return <ProjectDetails optimization={optimization} />;
};

export default ProjectDetailsContainer;