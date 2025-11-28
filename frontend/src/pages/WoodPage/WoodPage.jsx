import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WoodPage.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import chene from '../../assets/imgs/Wood/chene.jpg';
import pine from '../../assets/imgs/Wood/pine.jpg';
import erable from '../../assets/imgs/Wood/erable.jpg';
import noyer from '../../assets/imgs/Wood/noyer.jpg';
import cedre from '../../assets/imgs/Wood/cedre.jpg';
import acajou from '../../assets/imgs/Wood/acajou.jpg';

const woodCategories = [
  {
    name: "chene",
    displayName: "Chêne",
    description: "Le chêne est un bois dur et résistant, souvent utilisé pour les meubles et les parquets.",
    image: chene,
    details: "Le chêne est un bois très apprécié pour sa durabilité et sa beauté. Il est souvent utilisé dans la fabrication de meubles, de parquets et de tonneaux pour le vieillissement du vin. Le chêne est également utilisé pour la construction de charpentes et de structures en bois massif.",
    additionalImages: [
      chene
    ]
  },
  {
    name: "pin",
    displayName: "Pin",
    description: "Le pin est un bois léger et économique, souvent utilisé pour les constructions et les meubles.",
    image: pine,
    details: "Le pin est un bois léger et économique, souvent utilisé dans la construction et la fabrication de meubles. Il est également apprécié pour sa facilité de travail. Le pin est souvent utilisé pour les charpentes, les menuiseries intérieures et les meubles en kit.",
    additionalImages: [
      pine
    ]
  },
  {
    name: "erable",
    displayName: "Érable",
    description: "L'érable est un bois dur et dense, souvent utilisé pour les meubles et les instruments de musique.",
    image: erable,
    details: "L'érable est un bois dur et dense, souvent utilisé dans la fabrication de meubles, de parquets et d'instruments de musique. Il est apprécié pour sa résistance et sa belle finition. L'érable est également utilisé pour les plans de travail, les escaliers et les revêtements de sol.",
    additionalImages: [
      erable
    ]
  },
  {
    name: "noyer",
    displayName: "Noyer",
    description: "Le noyer est un bois dur et précieux, souvent utilisé pour les meubles haut de gamme.",
    image: noyer,
    details: "Le noyer est un bois dur et précieux, souvent utilisé dans la fabrication de meubles haut de gamme et de placages. Il est apprécié pour sa couleur riche et sa durabilité. Le noyer est également utilisé pour les instruments de musique, les sculptures et les objets décoratifs.",
    additionalImages: [
      noyer
    ]
  },
  {
    name: "cedre",
    displayName: "Cèdre",
    description: "Le cèdre est un bois résistant à l'humidité, souvent utilisé pour les extérieurs et les meubles de jardin.",
    image: cedre,
    details: "Le cèdre est un bois résistant à l'humidité et aux insectes, souvent utilisé dans la construction extérieure et la fabrication de meubles de jardin. Il est apprécié pour son parfum agréable et sa durabilité. Le cèdre est également utilisé pour les bardages, les clôtures et les coffres de rangement.",
    additionalImages: [
      cedre
    ]
  },
  {
    name: "acajou",
    displayName: "Acajou",
    description: "L'acajou est un bois dur et stable, souvent utilisé pour les meubles et les instruments de musique.",
    image: acajou,
    details: "L'acajou est un bois dur et stable, souvent utilisé dans la fabrication de meubles, d'instruments de musique et de bateaux. Il est apprécié pour sa couleur riche et sa stabilité dimensionnelle. L'acajou est également utilisé pour les placages, les sculptures et les objets décoratifs.",
    additionalImages: [
      acajou
    ]
  }
];

function WoodPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Bois | OptimCut";
    AOS.init({ once: true, offset: 100 });
  }, []);

  return (
    <div className="wood-pageMain">
      <h1>Catégories de Bois</h1>
      <div className="wood-galleryMain">
        {woodCategories.map((category, index) => (
          <div key={index} className="wood-categoryMain" data-aos="fade-up" data-aos-duration="1000">
            <img onClick={() => navigate(`/wood/${category.name}`)} src={category.image} alt={`Image de ${category.displayName}`} className="wood-imageMain" />
            <h2>{category.displayName}</h2>
            <p>{category.description}</p>
            <button onClick={() => navigate(`/wood/${category.name}`)}>En savoir plus</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WoodPage;