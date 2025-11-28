import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './WoodDetailPage.css';

// Import wood images
import chene from '../../assets/imgs/Wood/chene.jpg';
import pine from '../../assets/imgs/Wood/pine.jpg';
import erable from '../../assets/imgs/Wood/erable.jpg';
import noyer from '../../assets/imgs/Wood/noyer.jpg';
import cedre from '../../assets/imgs/Wood/cedre.jpg';
import acajou from '../../assets/imgs/Wood/acajou.jpg';

import chenedoc from '../../assets/imgs/Wood/chenedoc.jpg';
import pinedoc from '../../assets/imgs/Wood/pindoc.jpg';
import erabledoc from '../../assets/imgs/Wood/erabledoc.jpg';
import noyerdoc from '../../assets/imgs/Wood/noyerdoc.jpg';
import cedredoc from '../../assets/imgs/Wood/cedredoc.jpg';
import acajoudoc from '../../assets/imgs/Wood/acajoudoc.jpg';

import chenewood from '../../assets/imgs/Wood/chenewood.avif';
import pinewood from '../../assets/imgs/Wood/pinwood.jpg';
import erablewood from '../../assets/imgs/Wood/erablewood.jpg';
import noyerwood from '../../assets/imgs/Wood/noyerwood.jpg';
import cedrewood from '../../assets/imgs/Wood/cedrewood.jpg';
import acajouwood from '../../assets/imgs/Wood/acajouwood.jpg';

// Wood data with expanded information including grain and color
const woodCategories = [
  {
    name: "chene",
    displayName: "Chêne",
    description: "Le chêne est un bois dur et résistant, souvent utilisé pour les meubles et les parquets.",
    details: "Le chêne est un bois très apprécié pour sa durabilité et sa beauté. Il est souvent utilisé dans la fabrication de meubles, de parquets et de tonneaux pour le vieillissement du vin. Le chêne est également utilisé pour la construction de charpentes et de structures en bois massif.",
    grain: "Grain droit avec texture prononcée, présente souvent des rayons médullaires visibles qui créent des motifs distinctifs.",
    color: "Varie du brun clair au brun doré, avec parfois des nuances rosées ou jaunâtres.",
    color_code: {
      color1: "#A52A2A",
      color2: "#996515",
    },
    technicalSpecs: {
      density: "0.75 g/cm³",
      hardness: "Élevée",
      durability: "25+ ans",
      workability: "Moyenne"
    },
    uses: ["Meubles", "Parquets", "Charpentes", "Tonneaux", "Escaliers"],
    maintenance: "Nettoyez régulièrement avec un chiffon humide. Appliquez une cire ou une huile spécifique tous les 6 à 12 mois pour préserver l'aspect et la protection.",
    images: [chene, chenedoc, chenewood]
  },
  {
    name: "pin",
    displayName: "Pin",
    description: "Le pin est un bois léger et économique, souvent utilisé pour les constructions et les meubles.",
    details: "Le pin est un bois léger et économique, souvent utilisé dans la construction et la fabrication de meubles. Il est également apprécié pour sa facilité de travail. Le pin est souvent utilisé pour les charpentes, les menuiseries intérieures et les meubles en kit.",
    grain: "Grain droit avec des nœuds caractéristiques. Texture moyenne à grossière avec des cernes de croissance bien visibles.",
    color: "Jaune pâle à brun rougeâtre clair, s'assombrit légèrement avec le temps.",
    color_code: {
      color1: "#FFFF99",
      color2: "#C47A6E",
    },
    technicalSpecs: {
      density: "0.52 g/cm³",
      hardness: "Faible à moyenne",
      durability: "10-15 ans",
      workability: "Excellente"
    },
    uses: ["Meubles en kit", "Menuiseries intérieures", "Charpentes", "Lambris", "Caisses"],
    maintenance: "Nettoyez avec un chiffon légèrement humide. Pour les meubles, appliquez une cire tous les 12 mois. Pour les usages extérieurs, un traitement contre les insectes et l'humidité est nécessaire.",
    images: [pine, pinedoc, pinewood]
  },
  {
    name: "erable",
    displayName: "Érable",
    description: "L'érable est un bois dur et dense, souvent utilisé pour les meubles et les instruments de musique.",
    details: "L'érable est un bois dur et dense, souvent utilisé dans la fabrication de meubles, de parquets et d'instruments de musique. Il est apprécié pour sa résistance et sa belle finition. L'érable est également utilisé pour les plans de travail, les escaliers et les revêtements de sol.",
    grain: "Grain généralement droit mais peut présenter des motifs ondulés ou figurés ('érable ondé' ou 'érable flammé'). Texture fine et uniforme.",
    color: "Blanc crème à brun très clair, avec parfois des reflets dorés.",
    color_code: {
      color1: "#FFF5E1",
      color2: "#E6C7A0",
    },
    technicalSpecs: {
      density: "0.70 g/cm³",
      hardness: "Élevée",
      durability: "20+ ans",
      workability: "Bonne"
    },
    uses: ["Instruments de musique", "Meubles", "Parquets", "Plans de travail", "Ustensiles de cuisine"],
    maintenance: "Essuyez immédiatement les liquides renversés. Nettoyez avec un chiffon doux et légèrement humide. Appliquez une huile ou une cire spécifique tous les 12 mois.",
    images: [erable, erabledoc, erablewood]
  },
  {
    name: "noyer",
    displayName: "Noyer",
    description: "Le noyer est un bois dur et précieux, souvent utilisé pour les meubles haut de gamme.",
    details: "Le noyer est un bois dur et précieux, souvent utilisé dans la fabrication de meubles haut de gamme et de placages. Il est apprécié pour sa couleur riche et sa durabilité. Le noyer est également utilisé pour les instruments de musique, les sculptures et les objets décoratifs.",
    grain: "Grain généralement droit mais peut être ondulé. Texture moyenne à fine avec des motifs distinctifs.",
    color: "Varie du brun clair au brun foncé chocolat, avec souvent des stries plus foncées. L'aubier est plus clair, blanc crème.",
    color_code: {
      color1: "#C8A165",
      color2: "#654321",
    },
    technicalSpecs: {
      density: "0.65 g/cm³",
      hardness: "Moyenne à élevée",
      durability: "30+ ans",
      workability: "Très bonne"
    },
    uses: ["Meubles haut de gamme", "Placages", "Sculptures", "Instruments de musique", "Objets décoratifs"],
    maintenance: "Évitez l'exposition prolongée à la lumière directe du soleil. Nettoyez avec un chiffon doux et sec. Appliquez une cire ou une huile spécifique tous les 6 mois pour préserver sa couleur et son éclat.",
    images: [noyer, noyerdoc, noyerwood]
  },
  {
    name: "cedre",
    displayName: "Cèdre",
    description: "Le cèdre est un bois résistant à l'humidité, souvent utilisé pour les extérieurs et les meubles de jardin.",
    details: "Le cèdre est un bois résistant à l'humidité et aux insectes, souvent utilisé dans la construction extérieure et la fabrication de meubles de jardin. Il est apprécié pour son parfum agréable et sa durabilité. Le cèdre est également utilisé pour les bardages, les clôtures et les coffres de rangement.",
    grain: "Grain droit avec texture moyenne à grossière. Présente généralement des nœuds et des cernes de croissance bien visibles.",
    color: "Brun rougeâtre à rosé, avec des variations de teintes. Tend à griser naturellement en extérieur.",
    color_code: {
      color1: "#A65E2E",
      color2: "#C08081",
    },
    technicalSpecs: {
      density: "0.45 g/cm³",
      hardness: "Faible à moyenne",
      durability: "25+ ans (extérieur)",
      workability: "Excellente"
    },
    uses: ["Meubles d'extérieur", "Bardages", "Clôtures", "Coffres", "Saunas"],
    maintenance: "Pour l'extérieur, appliquez une huile de protection tous les 1-2 ans. Le cèdre peut griser naturellement avec le temps si non traité, ce qui est souvent recherché pour son aspect authentique.",
    images: [cedre, cedredoc, cedrewood]
  },
  {
    name: "acajou",
    displayName: "Acajou",
    description: "L'acajou est un bois dur et stable, souvent utilisé pour les meubles et les instruments de musique.",
    details: "L'acajou est un bois dur et stable, souvent utilisé dans la fabrication de meubles, d'instruments de musique et de bateaux. Il est apprécié pour sa couleur riche et sa stabilité dimensionnelle. L'acajou est également utilisé pour les placages, les sculptures et les objets décoratifs.",
    grain: "Grain légèrement entrecroisé qui crée un motif rubanné ou moiré caractéristique. Texture moyennement fine et uniforme.",
    color: "Brun-rouge à acajou foncé, s'assombrit et se patine avec le temps.",
    color_code: {
      color1: "#9E2A2F",
      color2: "#3E1C1B",
    },
    technicalSpecs: {
      density: "0.55 g/cm³",
      hardness: "Moyenne",
      durability: "20+ ans",
      workability: "Excellente"
    },
    uses: ["Meubles", "Instruments de musique", "Construction navale", "Placages", "Sculptures"],
    maintenance: "Nettoyez avec un chiffon doux légèrement humide. Appliquez une cire tous les 3-6 mois pour maintenir son éclat. Évitez l'exposition directe prolongée au soleil pour préserver sa couleur.",
    images: [acajou, acajoudoc, acajouwood]
  }
];

function WoodDetailPage() {
  const { name } = useParams();
  const wood = woodCategories.find(category => category.name === name);
  const [galleryImages, setGalleryImages] = useState([]);

  // Function to generate random rotation and position styles
  const generateRandomStyles = (images) => {
    return images.map((image) => {
      // Random rotation between -15 and 15 degrees
      const rotation = Math.floor(Math.random() * 31) - 15;
      
      // Random position adjustments
      const posX = Math.floor(Math.random() * 21) - 10; // -10px to 10px
      const posY = Math.floor(Math.random() * 21) - 10; // -10px to 10px
      
      // Random scale adjustment - subtle
      const scale = 0.95 + (Math.random() * 0.1); // 0.95 to 1.05
      
      // Random z-index for layering effect (1-10)
      const zIndex = Math.floor(Math.random() * 10) + 1;
      
      return {
        image: image,
        style: {
          transform: `rotate(${rotation}deg) translate(${posX}px, ${posY}px) scale(${scale})`,
          zIndex: zIndex,
          margin: `${Math.floor(Math.random() * 20) + 10}px auto`, // Random margin
          boxShadow: `${Math.floor(Math.random() * 10)}px ${Math.floor(Math.random() * 10)}px ${Math.floor(Math.random() * 10) + 5}px rgba(0,0,0,0.${Math.floor(Math.random() * 5) + 1})` // Random shadow
        }
      };
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (wood) {
      document.title = `${wood.displayName} | OptimCut`;
      
      // Generate random styles for images
      setGalleryImages(generateRandomStyles(wood.images));
    }
  }, [wood]);

  // Function to refresh gallery layout
  const refreshGallery = () => {
    if (wood) {
      setGalleryImages(generateRandomStyles(wood.images));
    }
  };

  if (!wood) {
    return (
      <div className="wood-not-found">
        <h1>Bois non trouvé</h1>
        <p>Le type de bois que vous recherchez n'est pas disponible dans notre catalogue.</p>
      </div>
    );
  }

  return (
    <div className="wood-detail-container">
      <header className="wood-detail-header">
        <h1>{wood.displayName}</h1>
        <p className="wood-tagline">{wood.description}</p>
      </header>

      <div className="wood-detail-content">
        <section className="wood-gallery" onClick={refreshGallery}>
          <button className="refresh-gallery-btn" onClick={refreshGallery}>
            Réorganiser les images
          </button>
          
          <div className="gallery-container">
            {galleryImages.map((item, index) => (
              <div 
                key={index} 
                className="wood-image-container"
              >
                <img 
                  src={item.image} 
                  alt={`${wood.displayName} - Vue ${index + 1}`} 
                  className="wood-image" 
                  style={item.style}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="wood-information">
          <div className="wood-details">
            <h2>Détails</h2>
            <p>{wood.details}</p>
          </div>
          
          <div className="wood-appearance">
            <h2>Apparence</h2>
            <div className="appearance-grid">
              <div className="appearance-item">
                <h3>Grain</h3>
                <p>{wood.grain}</p>
              </div>
              <div className="appearance-item">
                <h3>Couleur</h3>
                <p>{wood.color}</p>
                <div className="color-preview">
                  <div
                    className="color-sample"
                    style={{
                      backgroundColor:
                        wood.name === "chene"
                          ? "#D4B37F"
                          : wood.name === "pin"
                          ? "#ECD9A8"
                          : wood.name === "erable"
                          ? "#F5E7CE"
                          : wood.name === "noyer"
                          ? "#73472B"
                          : wood.name === "cedre"
                          ? "#C15B40"
                          : wood.name === "acajou"
                          ? "#8D2E1F"
                          : "#D4B37F",
                    }}
                    title={`${wood.color_code.color1} à ${wood.color_code.color2}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="wood-specs">
            <h2>Spécifications techniques</h2>
            <ul>
              <li><strong>Densité:</strong> {wood.technicalSpecs.density}</li>
              <li><strong>Dureté:</strong> {wood.technicalSpecs.hardness}</li>
              <li><strong>Durabilité:</strong> {wood.technicalSpecs.durability}</li>
              <li><strong>Facilité de travail:</strong> {wood.technicalSpecs.workability}</li>
            </ul>
          </div>
          
          <div className="wood-uses">
            <h2>Utilisations courantes</h2>
            <ul className="uses-list">
              {wood.uses.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>
          
          <div className="wood-maintenance">
            <h2>Entretien</h2>
            <p>{wood.maintenance}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default WoodDetailPage;