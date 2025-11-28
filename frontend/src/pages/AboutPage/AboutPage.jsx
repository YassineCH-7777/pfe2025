import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './AboutPage.css';

import techIcon1 from '../../assets/icons/ai-icon.svg';
import techIcon2 from '../../assets/icons/optimization-icon.svg';
import techIcon3 from '../../assets/icons/robot-icon.svg';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "À propos | OptimCut";
  }, []);

  // Définitions des animations pour un rendu fluide et professionnel
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: techIcon1,
      title: "IA Avancée",
      description: "Algorithmes d'intelligence artificielle optimisant les schémas de découpe pour réduire les pertes de matériau jusqu'à 30%."
    },
    {
      icon: techIcon2,
      title: "Gestion Intelligente",
      description: "Système de suivi et catalogage des chutes réutilisables pour maximiser la rentabilité et minimiser les déchets."
    },
    {
      icon: techIcon3,
      title: "Automatisation Complète",
      description: "Génération automatique de fichiers de commande compatibles avec les robots de découpe industriels."
    }
  ];

  const goals = [
    "Réduire les pertes de matériaux de 30% minimum",
    "Diminuer l'empreinte carbone de l'industrie du bois",
    "Augmenter la productivité des ateliers de menuiserie",
    "Simplifier le processus de découpe industrielle",
    "Intégrer des pratiques durables dans la chaîne de production"
  ];

  const stats = [
    { value: "-30%", description: "Réduction des déchets" },
    { value: "+25%", description: "Gain de productivité" },
    { value: "100%", description: "Compatible avec les robots industriels" }
  ];

  return (
    <motion.div 
      className="about-page"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Section Hero */}
      <motion.section className="about-hero" variants={fadeIn}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div variants={fadeInUp} className="about-content">
                <motion.h2 
                  className="text-center mb-5 section-title"
                  variants={fadeInUp}
                  aria-label="Notre Mission"
                >
                  Notre Mission
                </motion.h2>
                <p className="lead">
                  Optimiser l'industrie du bois grâce à une technologie de pointe respectueuse de l'environnement.
                </p>
                <hr className="divider" />
                <p className="about-description">
                  OptimCut est une solution innovante développée dans le cadre d'un projet de fin d'études, visant à révolutionner la découpe des panneaux de bois grâce à l'intelligence artificielle.
                </p>
                <motion.button 
                  variants={fadeInUp} 
                  className="btn btn-primary mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/optimise'}
                >
                  Découvrir la solution
                </motion.button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.section>

      {/* Section Caractéristiques */}
      <motion.section className="about-features" variants={fadeIn}>
        <Container>
          <motion.h2 
            className="text-center mb-5 section-title"
            variants={fadeInUp}
            aria-label="Notre Technologie"
          >
            Notre Technologie
          </motion.h2>
          <div className="features-row">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                variants={fadeInUp}
                transition={{ delay: index * 0.2 }}
              >
                <Card.Body className="text-center">
                  <div className="feature-icon-container">
                    <img 
                      src={feature.icon} 
                      alt={`Icône représentant ${feature.title}`} 
                      className="feature-icon" 
                      loading="lazy" 
                    />
                  </div>
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.section>

      {/* Section Objectifs */}
      <motion.section className="about-goals" variants={fadeIn}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div variants={fadeInUp} className="goals-content">
                <h2>Nos Objectifs</h2>
                <motion.ul className="goals-list" variants={staggerContainer}>
                  {goals.map((goal, index) => (
                    <motion.li key={index} variants={fadeInUp}>
                      {goal}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div variants={fadeInUp} className="stats-container">
                {stats.map((stat, index) => (
                  <motion.div key={index} className="statA-card" variants={fadeInUp}>
                    <h3>{stat.value}</h3>
                    <p>{stat.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.section>
    </motion.div>
  );
};

export default React.memo(AboutPage);