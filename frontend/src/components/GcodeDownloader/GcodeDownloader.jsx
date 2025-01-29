import React from 'react';
import ApiService from '../../utils/ApiService';
import './GcodeDownloader.css';

function GcodeDownloader() {
  const downloadGCode = async () => {
    try {
      const blob = await ApiService.downloadGCode();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'cutting_plan.gcode';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Erreur lors du téléchargement du fichier GCode : ${error.message}`);
    }
  };

  return (
    <button className="download-button" onClick={downloadGCode}>
      Télécharger le GCode
    </button>
  );
}

export default GcodeDownloader;