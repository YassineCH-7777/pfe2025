import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate, NavLink } from "react-router-dom";
import ApiService from "../../utils/ApiService";
import { FaSignOutAlt, FaUserEdit, FaHistory, FaHome } from "react-icons/fa";
import ProfileUpdate from "../updateProfil/updateProfil";
import ProjectsHistory from "../ProjectsHistory/ProjectsHistory";
import DashboardHome from "../DashboardHome/DashboardHome"; // Le composant modifié
import "./Dashboard.css";
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [optimizationHistory, setOptimizationHistory] = useState([]);
    const [activeSection, setActiveSection] = React.useState('dashboard');
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Tableau de Board | OptimCut";
        if (!user) {
            navigate("/login");
        } else {
            fetchOptimizationHistory();
        }
    }, [user, navigate]);

    const fetchOptimizationHistory = async () => {
        try {
            const response = await ApiService.get("/api/history");
            let historyData = response.history;
            let historyArray = [];

            if (Array.isArray(historyData)) {
                historyArray = historyData;
            } else if (historyData && typeof historyData === "object") {
                historyArray = Object.values(historyData);
            }

            // Filtrer les entrées nulles ou invalides
            historyArray = historyArray.filter((item) => item && item.projectName && item.timestamp);

            // Tri décroissant par date
            historyArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setOptimizationHistory(historyArray);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique des optimisations", error);
        }
    };

    // Fonction pour supprimer un projet
    const handleDelete = async (projectId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            try {
                await ApiService.delete(`/api/projects/${projectId}`);
                // Recharger l'historique après suppression
                fetchOptimizationHistory();
            } catch (error) {
                console.error("Erreur lors de la suppression du projet", error);
                alert("Échec de la suppression: " + (error.response?.data?.error || error.message));
            }
        }
    };

    React.useEffect(() => {
        if (location.state?.section) {
            setActiveSection(location.state.section);
        }
    }, [location.state]);

    const renderSection = () => {
        switch (activeSection) {
            case "dashboard":
                return <DashboardHome 
                          user={user} 
                          optimizationHistory={optimizationHistory} 
                          handleDelete={handleDelete}
                          setActiveSection={setActiveSection}
                       />;
            case "projects":
                return <ProjectsHistory />;
            case "update-profile":
                return <ProfileUpdate />;
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <nav className="menu">
                    <button className={`menu-item ${activeSection === "dashboard" ? "active" : ""}`} onClick={() => setActiveSection("dashboard")}>
                        <FaHome className="icon" /> Dashboard
                    </button>
                    <button className={`menu-item ${activeSection === "projects" ? "active" : ""}`} onClick={() => setActiveSection("projects")}>
                        <FaHistory className="icon" /> Historique des projets
                    </button>
                    <button className={`menu-item ${activeSection === "update-profile" ? "active" : ""}`} onClick={() => setActiveSection("update-profile")}>
                        <FaUserEdit className="icon" /> Modifier le profil
                    </button>
                    <button className="menu-item logout" onClick={logout}>
                        <FaSignOutAlt className="icon" /> Déconnexion
                    </button>
                </nav>
            </aside>

            <main className="dashboard-main">
                {renderSection()}
            </main>
        </div>
    );
};

export default Dashboard;