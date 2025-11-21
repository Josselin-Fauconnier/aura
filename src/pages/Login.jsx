// src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth'; 
import { MOCKED_AUTH_CLIENT, MOCKED_AUTH_PROVIDER } from '../mocks/mockData'; 

// [PASSE EN PRODUCTION] Endpoint réel pour la connexion
const LOGIN_ENDPOINT = 'http://localhost:8000/api/connexion'; 

// Fonction simulée qui agit comme le backend
const mockLoginApi = async (email, password, role) => {
    // Simule la latence du réseau (1s)
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    const targetMock = role === 'customer' ? MOCKED_AUTH_CLIENT : MOCKED_AUTH_PROVIDER;
    
    // Test des identifiants mockés (selon les adresses de mockData.js)
    const isClientMatch = email === MOCKED_AUTH_CLIENT.user.email && password === "1234" && role === 'customer';
    const isProviderMatch = email === MOCKED_AUTH_PROVIDER.user.email && password === "1234" && role === 'provider';

    if (isClientMatch || isProviderMatch) {
        // Simule une réponse OK (statut 200)
        return { ok: true, data: targetMock };
    } else {
        // Simule une réponse échouée (statut 401)
        return { 
            ok: false, 
            status: 401, 
            data: { message: `Login failed. Use credentials for the selected role and 1234.` } 
        };
    }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mockRole, setMockRole] = useState('customer'); 

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
        // Le code prêt pour la production utilise la fonction mockée
        const response = await mockLoginApi(email, password, mockRole); 

        if (!response.ok) {
            const errorData = response.data || { message: 'Unknown error.' }; 
            setErrorMessage(errorData.message);
            return; // Arrête la fonction ici
        }
        
        // Connexion réussie
        const { user, token } = response.data;

        login({ user, token }); 
        
        if (mockRole === 'provider') {
            navigate('/prestataire/dashboard');
        } else {
            navigate('/profil');
        }
        
    } catch {
        setErrorMessage('Network error. Could not contact simulation server.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '900px', margin: '50px auto', gap: '40px' }}>
      
      {/* PARTIE 1 : CONNEXION (Formulaire) */}
      <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Connexion</h2>
        
        {/* SÉLECTION DU RÔLE DE CONNEXION (Mock only) */}
        <div style={{ marginBottom: '15px', border: '1px dashed #ccc', padding: '10px' }}>
            <label htmlFor="mock-role">Simuler la connexion en tant que:</label>
            <select 
                id="mock-role"
                value={mockRole} 
                onChange={(e) => setMockRole(e.target.value)} 
                disabled={loading}
                style={{ marginLeft: '10px' }}
            >
                <option value="customer">Client ({MOCKED_AUTH_CLIENT.user.email} / 1234)</option>
                <option value="provider">Prestataire ({MOCKED_AUTH_PROVIDER.user.email} / 1234)</option>
            </select>
        </div>
        
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        
        <form onSubmit={handleSubmit}>
          {/* Champs Email et Password */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} style={{ width: '100%' }} />
          </div>

          <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
            {loading ? 'Logging in...' : 'Se Connecter'}
          </button>
        </form>
      </div>

      {/* PARTIE 2 : INSCRIPTION (Liens) */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <h2>Nouvel Utilisateur?</h2>
        <p>Créez votre compte en fonction de votre rôle :</p>

        <div style={{ marginTop: '30px' }}>
          <Link to="/inscription/client" style={{ display: 'block', marginBottom: '15px', padding: '15px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', textAlign: 'center', borderRadius: '5px' }}>
            S'inscrire en tant que **Client**
          </Link>
          <Link to="/inscription/prestataire" style={{ display: 'block', padding: '15px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', textAlign: 'center', borderRadius: '5px' }}>
            S'inscrire en tant que **Prestataire**
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;