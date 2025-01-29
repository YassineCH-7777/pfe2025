import React, { useEffect, useRef } from 'react';
import './CuttingVisualization.css';

function CuttingVisualization({ layout, panelWidth, panelHeight }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!layout || layout.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Scale the panel dimensions to fit the canvas
    const scaleX = canvasWidth / panelWidth;
    const scaleY = canvasHeight / panelHeight;
    const scale = Math.min(scaleX, scaleY);

    // Draw the main panel
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, panelWidth * scale, panelHeight * scale);

    // Draw each piece
    layout.forEach(({ id, x, y, width, height }) => {
      ctx.fillStyle = '#7D6349';
      ctx.fillRect(x * scale, y * scale, width * scale, height * scale);

      // Add a border around the piece
      ctx.strokeStyle = '#000';
      ctx.strokeRect(x * scale, y * scale, width * scale, height * scale);

      // Add the piece ID in the center
      const textX = (x + width / 2) * scale;
      const textY = (y + height / 2) * scale;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px Arial';
      ctx.fillText(`${id}`, textX, textY);
    });
  }, [layout, panelWidth, panelHeight]);

  return (
    <div className="visualization" data-aos="fade-in" data-aos-duration="2000">
      <h2>Observation Visuelle</h2>
      <canvas ref={canvasRef} width={1000} height={800} />
    </div>
  );
}

export default CuttingVisualization;