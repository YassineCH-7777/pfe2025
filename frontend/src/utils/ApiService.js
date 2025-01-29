const ApiService = {
  optimizeCut: async (data) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/optimize', {
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
      alert(`Erreur lors de l'optimisation : ${error.message}`);
      throw error;
    }
  },

  downloadGCode: async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/download', {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Échec du téléchargement du GCode');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cutting_plan.gcode';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert('Téléchargement réussi.');
    } catch (error) {
      console.error('Erreur lors du téléchargement du GCode :', error.message);
      alert(`Erreur lors du téléchargement du GCode : ${error.message}`);
      throw error;
    }
  },
};

export default ApiService;