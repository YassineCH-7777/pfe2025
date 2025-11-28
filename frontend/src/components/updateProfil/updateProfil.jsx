import React, { useState, useEffect } from "react";
import ApiService from "../../utils/ApiService";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "./updateProfil.css";

const ProfileUpdate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for name updates
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  // State for email updates
  const [email, setEmail] = useState(user?.email || "");
  const [newEmail, setNewEmail] = useState("");

  // State for password updates
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // State to track which sections are open
  const [openSections, setOpenSections] = useState({
    name: false,
    email: false,
    password: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Modifier Profile | OptimCut";
  }, []);

  // Toggle section visibility
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle name update
  const handleNameUpdate = async () => {
    try {
      const updates = { firstName, lastName };
      console.log("🔵 Envoi mise à jour du nom/prénom:", updates);
      const response = await ApiService.put("/api/update-profile", updates);
      console.log("🟢 Réponse API:", response);
      alert("Nom et prénom mis à jour");
      window.location.reload();
    } catch (error) {
      console.error("Update failed", error);
      alert("Échec de la mise à jour: " + (error.response?.data?.error || error.message));
    }
  };

  // Handle email update
  const handleEmailUpdate = async () => {
    try {
      const updates = { email: newEmail };
      console.log("🔵 Envoi mise à jour de l'email:", updates);
      const response = await ApiService.put("/api/update-profile", updates);
      alert("Email mis à jour");
      window.location.reload();
    } catch (error) {
      console.error("Update failed", error);
      alert("Échec de la mise à jour: " + (error.response?.data?.error || error.message));
    }
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    try {
      if (!oldPassword || !newPassword) {
        alert("Veuillez remplir tous les champs");
        return;
      }
      const updates = { oldPassword, newPassword };
      console.log("🔵 Envoi mise à jour du mot de passe:", updates);
      const response = await ApiService.put("/api/update-profile", updates);
      alert("Mot de passe mis à jour");
      window.location.reload();
    } catch (error) {
      console.error("Update failed", error);
      alert("Échec de la mise à jour: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="profile-update-container">
      <h2>Modifier le Profil</h2>

      <div className="profile-section">
        <div className="section-header" onClick={() => toggleSection("name")}>
          <h3>Modifier le nom et prénom</h3>
          <span className={`toggle-icon ${openSections.name ? "open" : ""}`}>▼</span>
        </div>
        <div className={`section-content ${openSections.name ? "open" : ""}`}>
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button onClick={handleNameUpdate}>Confirmer</button>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header" onClick={() => toggleSection("email")}>
          <h3>Modifier l'email</h3>
          <span className={`toggle-icon ${openSections.email ? "open" : ""}`}>▼</span>
        </div>
        <div className={`section-content ${openSections.email ? "open" : ""}`}>
          <p>Email actuel: {email}</p>
          <input
            type="email"
            placeholder="Nouvel email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button onClick={handleEmailUpdate}>Confirmer</button>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header" onClick={() => toggleSection("password")}>
          <h3>Modifier le mot de passe</h3>
          <span className={`toggle-icon ${openSections.password ? "open" : ""}`}>▼</span>
        </div>
        <div className={`section-content ${openSections.password ? "open" : ""}`}>
          <input
            type="password"
            placeholder="Ancien mot de passe"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handlePasswordUpdate}>Confirmer</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;