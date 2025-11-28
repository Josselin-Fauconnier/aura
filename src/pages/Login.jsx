import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import MockData from "../mocks/data.json";

// Regex simple pour la validation du format de l'email
const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [emailError, setEmailError] = useState(null); // Pour la validation d'email
  const [mockRole, setMockRole] = useState("customer");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Fonction pour valider le format de l'email à chaque frappe
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !strictEmailRegex.test(value)) {
      setEmailError("Format email invalide (ex: nom@domaine.fr)");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // 1. Bloquer si l'email est mal formaté
    if (emailError) {
      setErrorMessage("Veuillez corriger le format de l'email.");
      setLoading(false);
      return;
    }

    // 2. Détermine les données de test à partir du JSON
    const targetAuthData =
      mockRole === "customer"
        ? MockData.auth.client_success
        : MockData.auth.provider_success;

    const targetEmail = targetAuthData.user.email;
    const testPassword = "1234";

    // --- LOGIQUE DE SIMULATION DIRECTE ---
    setTimeout(() => {
      if (email === targetEmail && password === testPassword) {
        login(targetAuthData);

        if (mockRole === "provider") {
          navigate("/prestataire/dashboard");
        } else {
          navigate("/profil");
        }
      } else {
        setErrorMessage(
          `Login échoué. Utilisez l'email affiché / ${testPassword}.`
        );
      }

      setLoading(false);
    }, 1000);
  };

  return (
    // Utilisez des classes CSS au lieu de styles inline pour la structure
    <div className="auth-container">
      {/* PARTIE 1 : CONNEXION (Formulaire) */}
      <div className="auth-card login-card">
        <h2>Connexion</h2>

        {/* SÉLECTION DU RÔLE DE CONNEXION (Mock only) */}
        <div className="mock-role-selector">
          <label htmlFor="mock-role">Simuler la connexion en tant que:</label>
          <select
            id="mock-role"
            value={mockRole}
            onChange={(e) => setMockRole(e.target.value)}
            disabled={loading}
            className="mock-select"
          >
            {/* Utilise les emails du JSON */}
            <option value="customer">
              Client ({MockData.auth.client_success.user.email} / 1234)
            </option>
            <option value="provider">
              Prestataire ({MockData.auth.provider_success.user.email} / 1234)
            </option>
          </select>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Champ Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange} // Utilise la validation
              required
              disabled={loading}
            />
            {emailError && <p className="field-error">{emailError}</p>}
          </div>

          {/* Champ Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="btn primary-btn">
            {loading ? "Logging in..." : "Se Connecter"}
          </button>
        </form>
      </div>

      {/* PARTIE 2 : INSCRIPTION (Liens) */}
      <div className="auth-card register-links-card">
        <h2>Nouvel Utilisateur?</h2>
        <p>Créez votre compte en fonction de votre rôle :</p>

        <div className="link-group">
          <Link to="/inscription/client" className="btn client-btn">
            S'inscrire en tant que **Client**
          </Link>
          <Link to="/inscription/prestataire" className="btn provider-btn">
            S'inscrire en tant que **Prestataire**
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
