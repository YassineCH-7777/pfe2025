import React from "react";
import { FaFileAlt} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import "./DashboardHome.css";

const DashboardHome = ({ user, optimizationHistory, handleDelete }) => {
  const navigate = useNavigate();
  // Calculer le nombre total de projets
  const totalProjects = optimizationHistory.length;

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  // Récupérer le dernier projet
  const lastProject = optimizationHistory[0];

  return (
    <div className="dashboard-home">
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h2>Bienvenue, {user?.firstName} {user?.lastName}!</h2>
          <p className="user-email">{user?.email}</p>
          <p className="welcome-message">Voici un résumé de vos projets sur OptimCut.</p>
        </div>
        <div className="user-avatar">
          <div className="avatar-circle">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            <div>
              <NavLink 
                to="/dashboard" 
                state={{ section: "update-profile" }} 
                title="Modifier le profil"
                className="edit-icon"
              >
                <FontAwesomeIcon icon={faUserEdit} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-statsD">
        <div className="statD-card">
          <div className="statD-icon">
            <FaFileAlt />
          </div>
          <div className="statD-info">
            <h3>Projets Totaux</h3>
            <p className="statD-value">{totalProjects}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section recent-projects">
        <h2 className="sectionD-title">
          Dernier Optimisation
        </h2>

        {lastProject ? (
          <div className="projects-list">
            <div className="project-card">
              <h3>Nom du projet : {lastProject.projectName}</h3>
              <p>Date du projet: {formatDate(lastProject.timestamp)}</p>
              <div className="project-actions">
                <NavLink 
                  to={`/dashboard/projects/${lastProject.id}`} 
                  className="detail-link"
                >
                  Voir les détails
                </NavLink>
              </div>
            </div>
            <div className="view-all-projects">
            <NavLink 
              to="/dashboard" 
              state={{ section: "projects" }} 
              className="view-all-link"
            >
              Voir tous les projets
            </NavLink>
            </div>
          </div>
        ) : (
          <div className="no-projects">
            <p>Vous n'avez pas encore de projets d'optimisation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;