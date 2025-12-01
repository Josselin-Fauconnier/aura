// src/pages/RegisterProvider.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Vos Regex existantes
const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:+_#-])[A-Za-z\d@$!%*?&.,;:+_#-]{8,}$/;
// REGEX POUR LE NUMÉRO DE TÉLÉPHONE (Format français standard)
const phoneNumberRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const RegisterProvider = () => {
  // États des champs communs
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [sex, setSex] = useState("Autre");

  // États des champs spécifiques Prestataire
  const [siren, setSiren] = useState("");
  const [education, setEducation] = useState("");
  const [statut, setStatut] = useState("Micro-entreprise");

  // États de gestion
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fonction de Validation
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    // Validation 1: Nom et Prénom (minimum 2 caractères)
    if (name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères.";
      valid = false;
    }
    if (firstname.trim().length < 2) {
      newErrors.firstname = "Le prénom doit contenir au moins 2 caractères.";
      valid = false;
    }

    // Validation 2: Numéro de Téléphone
    if (!phoneNumberRegex.test(phoneNumber)) {
      newErrors.phoneNumber =
        "Format invalide. Utilisez 0X XX XX XX XX (ex: 01 23 45 67 89).";
      valid = false;
    }

    // Validation 3: Email
    if (!strictEmailRegex.test(email)) {
      newErrors.email = "Adresse email invalide.";
      valid = false;
    }

    // Validation 4: Password
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "8 caractères min (Maj, Min, Chiffre, Symbole requis)";
      valid = false;
    }

    // Validation 5: Confirmation Password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      valid = false;
    }

    // Validation 6: SIREN (9 chiffres requis par la BDD)
    if (!/^\d{9}$/.test(siren)) {
      newErrors.siren = "Le numéro SIREN doit contenir 9 chiffres.";
      valid = false;
    }

    // Validation des champs obligatoires (si trim() est vide)
    if (!name.trim()) {
      newErrors.name = "Le nom est obligatoire.";
      valid = false;
    }
    if (!firstname.trim()) {
      newErrors.firstname = "Le prénom est obligatoire.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    // Les données exactes à envoyer au Backend
    const registrationData = {
      name,
      firstname,
      email,
      password,
      phone_number: phoneNumber,
      address,
      sex,
      SIREN: siren,
      statut,
      education_experience: education,
    };
    console.log(
      "Inscription Prestataire validée et prête à être envoyée:",
      registrationData
    );

    // --- SIMULATION (à remplacer par l'API POST /api/inscription/prestataire) ---
    setTimeout(() => {
      alert(
        "Inscription Prestataire validée (simulée). Redirection vers la connexion."
      );
      setLoading(false);
      navigate("/connexion");
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-provider-card">
        <h3>Inscription Prestataire</h3>
        <form onSubmit={handleSubmit} className="register-form">
          {/* CHAMPS COMMUNS */}
          <div className="form-group">
            <label>Prénom:</label>
            <input
              type="text"
              name="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              disabled={loading}
            />
            {errors.firstname && (
              <p className="field-error">{errors.firstname}</p>
            )}{" "}
            {/* AFFICHAGE ERREUR PRENOM */}
          </div>
          <div className="form-group">
            <label>Nom:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}{" "}
            {/* AFFICHAGE ERREUR NOM */}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Téléphone:</label>
            <input
              type="tel"
              name="phone_number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={loading}
            />
            {errors.phoneNumber && (
              <p className="field-error">{errors.phoneNumber}</p>
            )}{" "}
            {/* AFFICHAGE ERREUR TÉLÉPHONE */}
          </div>
          <div className="form-group">
            <label>Adresse:</label>
            <input
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Sexe:</label>
            <select
              name="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              required
              disabled={loading}
            >
              <option value="F">Féminin (F)</option>
              <option value="M">Masculin (M)</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* CHAMPS SPÉCIFIQUES PRESTATAIRE */}
          <hr />
          <h4>Informations Professionnelles</h4>
          <div className="form-group">
            <label>SIREN (9 chiffres):</label>
            <input
              type="text"
              name="siren"
              value={siren}
              onChange={(e) => setSiren(e.target.value)}
              required
              disabled={loading}
            />
            {errors.siren && <p className="field-error">{errors.siren}</p>}
          </div>
          <div className="form-group">
            <label>Statut:</label>
            <select
              name="statut"
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              required
              disabled={loading}
            >
              <option value="Micro-entreprise">Micro-entreprise</option>
              <option value="EI">EI</option>
              <option value="EURL">EURL</option>
              <option value="SASU">SASU</option>
              <option value="SARL">SARL</option>
              <option value="SAS">SAS</option>
            </select>
          </div>
          <div className="form-group">
            <label>Expérience/Formation:</label>
            <textarea
              name="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              required
              disabled={loading}
              rows="3"
            />
          </div>

          {/* CHAMPS MOT DE PASSE */}
          <hr />
          <div className="form-group">
            <label>Mot de passe:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>
          <div className="form-group">
            <label>Confirmation:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn primary-btn">
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterProvider;
