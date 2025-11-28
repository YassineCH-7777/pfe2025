import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import de useNavigate
import ApiService from '../utils/ApiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialisation de navigate

    // Fonction pour vérifier le profil utilisateur
    const fetchUserProfile = async (token) => {
        try {
            const response = await ApiService.get('/api/me');
            if (response && response.user) {
                setUser(response.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erreur lors de la récupération du profil:", error);
            localStorage.removeItem('token');
            setUser(null);
            return false;
        }
    };

    // Vérifie la session au chargement
    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                await fetchUserProfile(token);
            }
            setLoading(false);
        };

        checkSession();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await ApiService.login(email, password);
            
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                // Récupérer les informations de l'utilisateur
                const userProfile = await fetchUserProfile(response.token);
                if (userProfile) {
                    return true;
                }
            }
            throw new Error("Échec de la récupération du profil utilisateur");
        } catch (error) {
            console.error("Erreur de connexion:", error);
            setError(error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate("/login"); // Redirection vers la page de connexion
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
    }
    return context;
};