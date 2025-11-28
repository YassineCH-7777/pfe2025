import React, { useEffect, useRef } from 'react';
import './CuttingVisualization.css';

function CuttingVisualization({ layout, panelWidth, panelHeight }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Fonction pour redimensionner le canvas
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const containerWidth = container.offsetWidth;
      const scale = containerWidth / panelWidth;
    
      // Ajuste la largeur et la hauteur du canvas
      canvas.width = panelWidth * scale;
      canvas.height = panelHeight * scale;
    
      // Redessine le contenu du canvas avec la nouvelle échelle
      drawCanvas(ctx, scale);
    };

    // Fonction pour dessiner le contenu du canvas
    const drawCanvas = (ctx, scale) => {
      if (!layout || layout.length === 0) return;
    
      // Efface le canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // Dessine le panneau principal
      ctx.fillStyle = '#ddd';
      ctx.fillRect(0, 0, panelWidth * scale, panelHeight * scale);
    
      // Dessine chaque pièce
      layout.forEach(({ id, x, y, width, height }) => {
        ctx.fillStyle = '#7D6349';
        ctx.fillRect(x * scale, y * scale, width * scale, height * scale);
    
        // Ajoute une bordure autour de chaque pièce
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x * scale, y * scale, width * scale, height * scale);
    
        // Ajoute l'ID de la pièce au centre
        const textX = (x + width / 2) * scale;
        const textY = (y + height / 2) * scale;
    
        // Ajuste dynamiquement la taille de la police en fonction de l'échelle
        const fontSize = Math.max(12, 10 * scale); // Taille minimale de 12px
        ctx.font = `${fontSize}px Arial`;
    
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(id, textX, textY);
      });
    };

    // Redimensionne le canvas au chargement et lors du redimensionnement de la fenêtre
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [layout, panelWidth, panelHeight]);

  return (
    <div className="visualization" data-aos="fade-in" data-aos-duration="2000">
      <h2>Observation Visuelle</h2>
      <div className="canvas-container">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default CuttingVisualization;