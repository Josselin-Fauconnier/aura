// src/pages/RegisterCustomer.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Vos Regex existantes
const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:+_#-])[A-Za-z\d@$!%*?&.,;:+_#-]{8,}$/;

// REGEX POUR LE NUMÉRO DE TÉLÉPHONE (Format français standard)
const phoneNumberRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const RegisterCustomer = () => {
  // 1. États des champs
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [sex, setSex] = useState("Autre");

  // 2. États de gestion
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // État pour stocker les erreurs de validation
  const navigate = useNavigate();

  // 3. Fonction de Validation
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
      newErrors.email = "Adresse email invalide (nom@domaine.fr)";
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

    // Validation des champs obligatoires (si trim() est vide)
    if (!name.trim()) {
      newErrors.name = "Le nom est obligatoire.";
      valid = false;
    }
    if (!firstname.trim()) {
      newErrors.firstname = "Le prénom est obligatoire.";
      valid = false;
    }
    // ... adresse, téléphone, email sont gérés par les autres checks

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Arrête la soumission si la validation Front-end échoue
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
    };
    console.log(
      "Inscription Client validée et prête à être envoyée:",
      registrationData
    );

    // --- SIMULATION (à remplacer par l'API POST /api/inscription/client) ---
    setTimeout(() => {
      alert(
        "Inscription Client validée (simulée). Redirection vers la connexion."
      );
      setLoading(false);
      navigate("/connexion");
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-customer-card">
        <h3>Inscription Client</h3>
        <form onSubmit={handleSubmit} className="register-form">
          {/* Champ Prénom */}
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
            )}
          </div>

          {/* Champ Nom */}
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
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          {/* Champ Email */}
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

          {/* Champ Téléphone */}
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
            )}
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

          {/* Champ Mot de passe */}
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

          {/* Champ Confirmation */}
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

export default RegisterCustomer;
