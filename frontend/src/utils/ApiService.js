import axios from 'axios';
const BASE_URL = "http://127.0.0.1:5000";

const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      const response = await fetch(`${BASE_URL}/api/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

        if (!response.ok) {
            throw new Error("Échec du rafraîchissement du token");
        }

        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        return data.access_token;
    } catch (error) {
        console.error("Erreur lors du rafraîchissement du token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        throw error;
    }
};

const ApiService = {
    optimizeCut: async (data) => {
        try {
            const response = await fetch(`${BASE_URL}/api/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erreur lors de la requête :', error.message);
            throw error;
        }
    },

    post: async (endpoint, data) => {
        return await ApiService.request(endpoint, "POST", data);
    },

    get: async (endpoint) => {
        return await ApiService.request(endpoint, "GET");
    },

    put: async (endpoint, data) => {
        return await ApiService.request(endpoint, "PUT", data);
    },

    delete: async (endpoint) => {  // Nouvelle méthode DELETE ajoutée
        return await ApiService.request(endpoint, "DELETE");
    },

    request: async (endpoint, method, data = null) => {
        try {
            let response = await fetch(`${BASE_URL}${endpoint}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: data ? JSON.stringify(data) : null,
            });

            if (response.status === 401) {
                console.log("Token expiré, tentative de rafraîchissement...");
                const newToken = await refreshToken();

                response = await fetch(`${BASE_URL}${endpoint}`, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${newToken}`
                    },
                    body: data ? JSON.stringify(data) : null,
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Une erreur est survenue");
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur API ${method}:`, error);
            throw error;
        }
    },

    login: async (email, password) => {
        return await ApiService.post("/api/login", { email, password });
    },

    getProfile: async () => {
        return await ApiService.get("/api/me");
    },

    saveOptimizationHistory: async (data) => {
        return await ApiService.post("/api/save-optimization", data);
    },

    getOptimizationDetails: async (id) => {
        return ApiService.get(`/api/projects/${id}`);
    },
      
    getHistory: async () => {
        return ApiService.get("/api/history");
    },

    deleteOptimizationHistory: async (id) => {
        try {
          const response = await ApiService.delete(`/api/history/${id}`);
          console.log("Réponse de suppression :", response);
          return response;
        } catch (error) {
          console.error("Erreur dans deleteOptimizationHistory :", error);
          throw error;
        }
    },

    submitContact: async (data) => {
        return await ApiService.post('/api/contact', data);
    },

    downloadGCode: async () => {
        const response = await axios.get('http://localhost:5000/api/download', {
            responseType: 'blob', // Important pour télécharger un fichier
        });
        return response.data; // Retourne le fichier en tant que Blob
    }
};

export default ApiService;