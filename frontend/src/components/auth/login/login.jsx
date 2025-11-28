import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/authContext";
import "./login.css";
import Spinner from "../../Spinner/Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Connexion | OptimCut";
    
    // Récupérer un message éventuel de la page d'inscription
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Nettoyage de l'historique pour éviter d'afficher le message à nouveau
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    setError("");
    setSuccessMessage("");
    setLoading(true);
    
    try {
      console.log("Tentative de connexion...");
      const success = await login(email, password);
      
      if (success) {
        console.log("Connexion réussie, redirection vers le dashboard...");
        navigate("/dashboard", { replace: true });
      } else {
        setError("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError(error.message || "Une erreur est survenue lors de la connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/register");
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
      x: "-100vw",
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
      className="login-container"
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
        Connexion à votre compte
      </motion.h2>
      
      {successMessage && (
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {successMessage}
        </motion.div>
      )}
      
      <form onSubmit={handleLogin}>
        <motion.div 
          className="input-group"
          variants={itemVariants}
          custom={1}
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
          className="input-group"
          variants={itemVariants}
          custom={2}
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
          className="register" 
          onClick={handleRegisterClick}
          variants={itemVariants}
          custom={3}
          initial="hidden"
          animate="visible"
          whileHover={{ x: 5, color: "#2c2218" }}
        >
          Pas encore de compte ? S'inscrire
        </motion.p>
        
        <motion.button 
          type="submit" 
          disabled={loading}
          variants={itemVariants}
          custom={4}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ y: 0, boxShadow: "none" }}
        >
          {loading ? <Spinner /> : "Se connecter"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Login;