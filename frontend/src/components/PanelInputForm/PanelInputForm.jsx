import React, { useState, useEffect } from 'react';
import ApiService from '../../utils/ApiService';
import CuttingVisualization from '../CuttingVisualization/CuttingVisualization';
import GcodeDownloader from '../GcodeDownloader/GcodeDownloader';
import './PanelInputForm.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function PanelInputForm({ onOptimize }) {

  useEffect(() => {
        AOS.init({ once: true, offset: 100 });
      }, []);

  const [panelWidth, setPanelWidth] = useState('');
  const [panelHeight, setPanelHeight] = useState('');
  const [pieces, setPieces] = useState([]);
  const [pieceWidth, setPieceWidth] = useState('');
  const [pieceHeight, setPieceHeight] = useState('');
  const [layout, setLayout] = useState([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isAddP, setIsAddP] = useState(false);

  // Paramètres personnalisés
  const [toolNumber, setToolNumber] = useState(1);
  const [toolDiameter, setToolDiameter] = useState(6);
  const [toolLength, setToolLength] = useState(50);
  const [safeZHeight, setSafeZHeight] = useState(5);
  const [cutDepth, setCutDepth] = useState(5);
  const [pieceCounter, setPieceCounter] = useState(1);

  const handleAddPiece = () => {
    const width = parseFloat(pieceWidth);
    const height = parseFloat(pieceHeight);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      alert('Veuillez entrer des dimensions valides.');
      return;
    }
    if (width > panelWidth || height > panelHeight) {
      alert('Veuillez entrer des dimensions inférieures par rapport aux dimensions du panneau.');
      return;
    }

    const newPiece = { width, height };
    setPieces([...pieces, newPiece]);
    setPieceCounter(pieceCounter + 1);
    setPieceWidth('');
    setPieceHeight('');
    setIsAddP(true);
  };

  const handleRemovePiece = (index) => {
    const updatedPieces = pieces.filter((_, i) => i !== index);
    setPieces(updatedPieces);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const panels = { width: panelWidth, height: panelHeight };
    const toolParams = {
      tool_number: toolNumber,
      tool_diameter: toolDiameter,
      tool_length: toolLength,
      safe_z_height: safeZHeight,
      cut_depth: cutDepth,
    };
    const payload = { panels, pieces, ...toolParams };

    try {
      const response = await ApiService.optimizeCut(payload);
      console.log('Response from backend:', response); // Ajoutez ce log
      setLayout(response.layout || []); // Assurez-vous que layout est un tableau
      setIsOptimized(true);
      onOptimize(response.layout, panels, toolParams);
    } catch (error) {
      alert("Erreur lors de l'optimisation.");
    }
  };

  return (
    <div className="app">
      <h1>
        <strong>Optimisation découpe de Bois</strong>
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="content">
          <div className="form-content">
            <h2>Les dimensions nécessaires</h2>

            <label>Largeur de Panneau:</label>
            <input type="number" value={panelWidth} onChange={(e) => setPanelWidth(e.target.value)} />

            <label>Hauteur de Panneau:</label>
            <input type="number" value={panelHeight} onChange={(e) => setPanelHeight(e.target.value)} />

            <h3>Ajouter des Pièces</h3>
            <label>Largeur de Pièce:</label>
            <input type="number" value={pieceWidth} onChange={(e) => setPieceWidth(e.target.value)} />
            <label>Hauteur de Pièce:</label>
            <input type="number" value={pieceHeight} onChange={(e) => setPieceHeight(e.target.value)} />
            <button type="button" onClick={handleAddPiece}>
              Ajouter une Pièce
            </button>
            {isAddP && <p data-aos="fade-left" data-aos-duration="500"><strong>Largeur x Hauteur :</strong></p>}
          </div>
          {isAddP && 
            <div className="tool-content" data-aos="fade-right" data-aos-duration="2500">
              <h2>Paramètres de l'Outil</h2>
              <div>
                <div className="form-group">
                  <label>Numéro de l'Outil :</label>
                  <input type="number" value={toolNumber} onChange={(e) => setToolNumber(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Diamètre de l'Outil (mm):</label>
                  <input type="number" value={toolDiameter} onChange={(e) => setToolDiameter(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Longueur de l'Outil (mm):</label>
                  <input type="number" value={toolLength} onChange={(e) => setToolLength(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Hauteur de Sécurité Z (mm):</label>
                  <input type="number" value={safeZHeight} onChange={(e) => setSafeZHeight(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Profondeur de Coupe (mm):</label>
                  <input type="number" value={cutDepth} onChange={(e) => setCutDepth(e.target.value)} />
                </div>
              </div>
            </div>
          }
        </div>

        <ul className="piece-list">
          {pieces.map((piece, index) => (
            <li key={index} className="piece-item" data-aos="fade-left" data-aos-duration="500">
              <strong>
                {piece.width} x {piece.height}
              </strong>
              <button className="delete-button" type="button" onClick={() => handleRemovePiece(index)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>

        {isAddP && <button type="submit" onClick={handleSubmit} data-aos="fade-left" data-aos-duration="2000">Optimiser</button>}
      </form>

      {/* Visualisation et téléchargement */}
      {isOptimized && <CuttingVisualization layout={layout} panelWidth={panelWidth} panelHeight={panelHeight} />}

      {isOptimized && (
        <div className="sammery">
          <h3>Résumé des Pièces :</h3>
          <ul className="piece-list">
            {layout.map((piece, index) => (
              <li key={index} className="piece-item" data-aos="fade-left" data-aos-duration="1000">
                <strong>
                  {piece.id}: {piece.width} x {piece.height}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOptimized && <GcodeDownloader />}
    </div>
  );
}

export default PanelInputForm;