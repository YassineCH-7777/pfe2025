import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './ProjectDetails.css';

const ProjectDetails = ({ optimization }) => {
  const navigate = useNavigate();

  const {
    gCode,
    layout,
    panels,
    projectName,
    timestamp,
    toolParams
  } = optimization;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${projectName} | OptimCut`;
  }, [projectName]);

  const downloadGCode = () => {
    const element = document.createElement('a');
    const file = new Blob([gCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${projectName.replace(/\s+/g, '_')}_gcode.nc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPDF = async () => {
    const element = document.querySelector('.report-content');
    if (!element) return;

    // Capture le contenu avec html2canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Résolution élevée
      useCORS: true,
      allowTaint: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // Définir les zones pour l'image et le G-Code sur une seule page
    const maxImageHeight = pdfHeight * 0.6; // 60% de la page pour l'image
    const contentWidth = pdfWidth - 2 * margin;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    // Redimensionner l'image pour qu'elle tienne dans maxImageHeight
    let finalImageHeight = contentHeight;
    if (contentHeight > maxImageHeight) {
      finalImageHeight = maxImageHeight;
    }
    pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, finalImageHeight);

    // Position pour le G-Code (juste après l'image)
    let yPosition = margin + finalImageHeight + 5;

    // Ajouter le G-Code en texte
    pdf.setFont('helvetica', 'bold'); // Police similaire à <h2>
    pdf.setFontSize(10); // Taille similaire à <h2>
    pdf.setTextColor(0, 0, 0); // Texte noir
    pdf.text('G-Code', margin+3, yPosition);

    pdf.setFont('courier', 'normal');
    pdf.setFontSize(6); // Taille réduite pour maximiser le contenu
    yPosition += 8;
    pdf.setTextColor(0, 0, 0);
    const gCodeLines = gCode.split('\n');
    const lineHeight = 3; // Espacement réduit entre les lignes
    const maxLines = Math.floor((pdfHeight - yPosition - margin) / lineHeight); // Nombre max de lignes possibles

    // Ajouter uniquement les lignes qui tiennent sur la page
    gCodeLines.slice(0, maxLines).forEach((line) => {
      pdf.text(line.substring(0, 90), margin+3, yPosition); // Limiter à 90 caractères par ligne
      yPosition += lineHeight;
    });

    // Si le G-Code est tronqué, ajouter une note
    if (gCodeLines.length > maxLines) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100); // Gris pour la note
      pdf.text(
        'G-Code tronqué. Téléchargez le fichier complet via le bouton "Télécharger G-Code" dans le site.',
        margin+3,
        yPosition + 6
      );
      yPosition += 10;
    }

    // Ajouter le logo et le nom du site dans le coin inférieur gauche
    const logoUrl = '/icons/icon384x384.png'; // Chemin du logo
    const siteName = 'OptimCut'; // Nom du site
    const logoWidth = 10; // Largeur du logo en mm
    const logoHeight = 10; // Hauteur du logo en mm
    const logoX = pdfWidth- (margin+15); // Position X (gauche)
    const logoY = pdfHeight - logoHeight - margin - 10; // Position Y (bas)

    // Ajouter le logo
    pdf.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Ajouter le nom du site au dessous du logo
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(74, 59, 47); // Texte noir
    pdf.text(siteName, logoX - 2, logoY + logoHeight / 2 + 10);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6);
    pdf.setTextColor(74, 59, 47); // Texte noir
    pdf.text('@ PFE Yassine CHATBI & Ilyas BAALOU 2025', pdfWidth - (pdfWidth / 2) - 19, pdfHeight - 3);
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(74, 59, 47); // Couleur bleue pour le lien
    pdf.text(
      'Téléchargez le fichier complet via le bouton "Télécharger G-Code" dans le site.',
      margin+3,
      yPosition + 6
    );

    // Sauvegarder le PDF
    pdf.save(`${projectName.replace(/\s+/g, '_')}_rapport.pdf`);
  };

  return (
    <div className="projectd-card">
      <div className="top-actions">
      <button onClick={() => navigate('/dashboard', { state: { section: "projects" } })} className="back-button">
        ← Retour
      </button>
      </div>
      <div className="report-content">
        <header className="projectd-header">
          <h1>Rapport d'Optimisation pour {projectName}</h1>
          <p className="timestamp">
            <strong>Date du projet :</strong> {new Date(timestamp).toLocaleString()}
          </p>
        </header>

        <section className="panel-section">
          <h2>Panneau</h2>
          <div className="panel-grid">
            <div className="panel-item">
              <span className="label">Largeur</span>
              <span className="value">{panels.width}</span>
            </div>
            <div className="panel-item">
              <span className="label">Hauteur</span>
              <span className="value">{panels.height}</span>
            </div>
          </div>
        </section>

        <section className="tool-params">
          <h2>Paramètres de l'Outil</h2>
          <div className="params-grid">
            {Object.entries(toolParams).map(([key, value]) => (
              <div key={key} className="param-item">
                <span className="label">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="layout-section">
          <h2>Pièces & Disposition</h2>
          {layout && layout.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Largeur</th>
                    <th>Hauteur</th>
                  </tr>
                </thead>
                <tbody>
                  {layout.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.x}</td>
                      <td>{item.y}</td>
                      <td>{item.width}</td>
                      <td>{item.height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">Aucune information de layout disponible.</p>
          )}
        </section>
      </div>

      <section className="gcode-section">
        <h2>G - Code</h2>
        <pre className="gcode">{gCode}</pre>
        <div className="download-buttons">
          <button onClick={downloadGCode} className="download-button gcode">
            Télécharger G - Code
          </button>
          <button onClick={downloadPDF} className="download-button pdf">
            Télécharger le Rapport en PDF
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;