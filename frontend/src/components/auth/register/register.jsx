import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApiService from "../../../utils/ApiService";
import "./register.css";
import Spinner from "../../Spinner/Spinner";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Inscription | OptimCut";
  }, []);

  const validateForm = () => {
    // Réinitialiser le message d'erreur
    setError("");

    // Vérifier que tous les champs sont remplis
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Veuillez remplir tous les champs");
      return false;
    }

    // Vérifier format email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      return false;
    }

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await ApiService.post("/api/register", { 
        firstName, lastName, email, password 
      });
      console.log("Inscription réussie");
      
      // Transition vers la page de connexion
      navigate("/login", { 
        state: { 
          message: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter." 
        } 
      });
    } catch (error) {
      console.error("Échec de l'inscription :", error);
      setError(error.response?.data?.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoginClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/login");
  };

  // Variants d'animation pour Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: "100vw",
      transition: { ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };
  
  return (
    <motion.div 
      className="register-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h2
        variants={itemVariants}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        Créer un compte
      </motion.h2>
      
      <form onSubmit={handleRegister}>
        <motion.div 
          className="name-grid"
          variants={itemVariants}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <input 
            type="text" 
            placeholder="Prénom" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} 
            required
            aria-label="Prénom"
          />
          <input 
            type="text" 
            placeholder="Nom" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} 
            required
            aria-label="Nom"
          />
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          custom={2}
          initial="hidden"
          animate="visible"
        >
          <input 
            type="email" 
            placeholder="Adresse email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
            aria-label="Email"
          />
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          custom={3}
          initial="hidden"
          animate="visible"
        >
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
            aria-label="Mot de passe"
          />
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          custom={4}
          initial="hidden"
          animate="visible"
        >
          <input 
            type="password" 
            placeholder="Confirmer le mot de passe" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
            aria-label="Confirmer le mot de passe"
          />
        </motion.div>
        
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
        
        <motion.p 
          className="login" 
          onClick={handleLoginClick}
          variants={itemVariants}
          custom={5}
          initial="hidden"
          animate="visible"
          whileHover={{ x: 5, color: "#2c2218" }}
        >
          Déjà un compte ? Se connecter
        </motion.p>
        
        <motion.button 
          type="submit" 
          disabled={loading}
          variants={itemVariants}
          custom={6}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ y: 0, boxShadow: "none" }}
        >
          {loading ? <Spinner /> : "S'inscrire"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Register;