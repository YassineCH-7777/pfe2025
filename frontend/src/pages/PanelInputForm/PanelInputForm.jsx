import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import ApiService from '../../utils/ApiService';
import CuttingVisualization from '../../components/CuttingVisualization/CuttingVisualization';
import GcodeDownloader from '../../components/GcodeDownloader/GcodeDownloader';
import './PanelInputForm.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion'; // Ajout de framer-motion pour les animations frame par frame
import Spinner from '../../components/Spinner/Spinner'; // Importation du composant Spinner

// Composant pour le champ de texte avec label flottant
const FloatingInput = ({ type, value, onChange, label, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isOccupied = value.toString().length > 0;
  
  return (
    <motion.div 
      className="floating-input-container"
      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
    >
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="floating-input"
        required={required}
        whileFocus={{ boxShadow: "0 0 8px rgba(0,0,0,0.2)" }}
      />
      <motion.label
        className={`floating-label ${isFocused || isOccupied ? 'active' : ''}`}
        animate={{ 
          top: isFocused || isOccupied ? '-12px' : '10px',
          fontSize: isFocused || isOccupied ? '12px' : '16px',
          color: isFocused ? '#4A3B2F' : isOccupied ? '#495057' : '#6c757d'
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
    </motion.div>
  );
};

function PanelInputForm({ onOptimize }) {
  const { user } = useAuth(); // Récupère l'utilisateur connecté (s'il y en a un)
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Optimisation | OptimCut";
    AOS.init({ once: true, offset: 100 });
  }, []);

  const [projectName, setProjectName] = useState('');
  const [panelWidth, setPanelWidth] = useState('');
  const [panelHeight, setPanelHeight] = useState('');
  const [pieces, setPieces] = useState([]);
  const [pieceWidth, setPieceWidth] = useState('');
  const [pieceHeight, setPieceHeight] = useState('');
  const [layout, setLayout] = useState([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isAddP, setIsAddP] = useState(false);
  const [pieceQuantity, setPieceQuantity] = useState(1);
  const [toolNumber, setToolNumber] = useState(1);
  const [toolDiameter, setToolDiameter] = useState(6);
  const [toolLength, setToolLength] = useState(50);
  const [safeZHeight, setSafeZHeight] = useState(5);
  const [cutDepth, setCutDepth] = useState(5);
  const [pieceCounter, setPieceCounter] = useState(1);

  // Animations avec framer-motion
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideIn = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleAddPiece = () => {
    const width = parseFloat(pieceWidth);
    const height = parseFloat(pieceHeight);
    const quantity = parseInt(pieceQuantity);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      alert('Veuillez entrer des dimensions valides.');
      return;
    }
    if (width > panelWidth || height > panelHeight) {
      alert('Veuillez entrer des dimensions inférieures par rapport aux dimensions du panneau.');
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      alert('Veuillez entrer une quantité valide.');
      return;
    }

    const newPieces = [];
    for (let i = 0; i < quantity; i++) {
      newPieces.push({ width, height });
    }

    setPieces([...pieces, ...newPieces]);
    setPieceCounter(pieceCounter + quantity);
    setPieceWidth('');
    setPieceHeight('');
    setPieceQuantity(1);
    setIsAddP(true);
  };

  const handleRemovePiece = (index) => {
    const updatedPieces = [...pieces];
    updatedPieces.splice(index, 1);
    setPieces(updatedPieces);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const panels = { width: panelWidth, height: panelHeight };
    const toolParams = {
      tool_number: toolNumber,
      tool_diameter: toolDiameter,
      tool_length: toolLength,
      safe_z_height: safeZHeight,
      cut_depth: cutDepth,
    };

    // Construction du payload.
    // Si l'utilisateur est connecté, on inclut le nom du projet.
    let payload = {
      panels,
      pieces,
      tool_number: toolNumber,
      tool_diameter: toolDiameter,
      tool_length: toolLength,
      safe_z_height: safeZHeight,
      cut_depth: cutDepth,
    };

    if (user) {
      payload.projectName = projectName;
    }

    console.log('Payload:', payload);

    try {
      const response = await ApiService.optimizeCut(payload);
      console.log('Response from backend:', response);
      setLayout(response.layout || []);
      setIsOptimized(true);
      onOptimize(response.layout, panels, toolParams);

      // Si l'utilisateur est connecté, on sauvegarde l'optimisation en incluant le nom du projet.
      if (user) {
        await ApiService.saveOptimizationHistory({
          projectName,
          panels,
          pieces,
          layout: response.layout,
          toolParams,
        });
      }
    } catch (error) {
      alert("Erreur lors de l'optimisation.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="app"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1 
        variants={popIn}
      >
        <strong>Optimisation découpe de Bois</strong>
      </motion.h1>

      <form onSubmit={handleSubmit}>
        <motion.div 
          className="content"
          variants={fadeIn}
        >
          <motion.div 
            className="form-content"
            variants={slideIn}
          >
            {user && (
              <motion.div variants={fadeIn}>
                <motion.h3 variants={slideIn}><strong>Nom du Projet</strong></motion.h3>
                <FloatingInput
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  label="Nom du projet"
                  required={true}
                />
              </motion.div>
            )}
            
            <motion.h2 variants={slideIn}>Les dimensions nécessaires</motion.h2>
            <FloatingInput
              type="number"
              value={panelWidth}
              onChange={(e) => setPanelWidth(e.target.value)}
              label="Largeur de Panneau"
            />
            <FloatingInput
              type="number"
              value={panelHeight}
              onChange={(e) => setPanelHeight(e.target.value)}
              label="Hauteur de Panneau"
            />

            <motion.h3 variants={slideIn}><strong>Ajouter des Pièces</strong></motion.h3>
            <FloatingInput
              type="number"
              value={pieceWidth}
              onChange={(e) => setPieceWidth(e.target.value)}
              label="Largeur de Pièce"
            />
            <FloatingInput
              type="number"
              value={pieceHeight}
              onChange={(e) => setPieceHeight(e.target.value)}
              label="Hauteur de Pièce"
            />
            <motion.div 
              className="form-group"
              variants={slideIn}
            >
              <FloatingInput
                type="number"
                value={pieceQuantity}
                onChange={(e) => setPieceQuantity(e.target.value)}
                label="Quantité de Pièce"
                required={true}
              />
            </motion.div>
            <motion.button 
              type="button" 
              onClick={handleAddPiece}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={popIn}
              className="add-button"
            >
              Ajouter une Pièce
            </motion.button>
          </motion.div>
          
          {isAddP && 
            <motion.div 
              className="tool-content" 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2 
                variants={fadeIn}
                initial="hidden"
                animate="visible"
              >
                Paramètres de l'Outil
              </motion.h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="form-group" variants={slideIn}>
                  <FloatingInput
                    type="number"
                    value={toolNumber}
                    onChange={(e) => setToolNumber(e.target.value)}
                    label="Numéro de l'Outil"
                  />
                </motion.div>
                <motion.div className="form-group" variants={slideIn}>
                  <FloatingInput
                    type="number"
                    value={toolDiameter}
                    onChange={(e) => setToolDiameter(e.target.value)}
                    label="Diamètre de l'Outil (mm)"
                  />
                </motion.div>
                <motion.div className="form-group" variants={slideIn}>
                  <FloatingInput
                    type="number"
                    value={toolLength}
                    onChange={(e) => setToolLength(e.target.value)}
                    label="Longueur de l'Outil (mm)"
                  />
                </motion.div>
                <motion.div className="form-group" variants={slideIn}>
                  <FloatingInput
                    type="number"
                    value={safeZHeight}
                    onChange={(e) => setSafeZHeight(e.target.value)}
                    label="Hauteur de Sécurité Z (mm)"
                  />
                </motion.div>
                <motion.div className="form-group" variants={slideIn}>
                  <FloatingInput
                    type="number"
                    value={cutDepth}
                    onChange={(e) => setCutDepth(e.target.value)}
                    label="Profondeur de Coupe (mm)"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          }
        </motion.div>

        {isAddP && (
          <motion.div 
            className="pieces-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p variants={fadeIn}>
              <strong>Largeur x Hauteur :</strong>
            </motion.p>
            <motion.ul 
              className="piece-list"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {pieces.map((piece, index) => (
                <motion.li 
                  key={index} 
                  className="piece-item"
                  variants={popIn}
                  whileHover={{ scale: 1.03, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                >
                  <strong>
                    {piece.width} x {piece.height}
                  </strong>
                  <motion.button
                    className="delete-Panelbutton"
                    type="button"
                    onClick={() => handleRemovePiece(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Supprimer
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}

        {isAddP && (
          <motion.div 
            className="submit-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.button 
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="optimize-button"
            >
              {loading ? <Spinner /> : 'Optimiser'}
            </motion.button>
          </motion.div>
        )}
      </form>
      
      {isOptimized && (
        <motion.div 
          className="output-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CuttingVisualization layout={layout} panelWidth={panelWidth} panelHeight={panelHeight} />
          </motion.div>
          
          <motion.div 
            className="sammery"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h3 
              variants={popIn}
              initial="hidden"
              animate="visible"
            >
              Résumé des Pièces :
            </motion.h3>
            <motion.ul 
              className="piece-list"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {layout.map((piece, index) => (
                <motion.li 
                  key={index} 
                  className="piece-item"
                  variants={popIn}
                  whileHover={{ scale: 1.03, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                >
                  <strong>
                    {piece.id}: {piece.width} x {piece.height}
                  </strong>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <GcodeDownloader />
          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
}

export default PanelInputForm;