import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth'; 
import MockData from '../mocks/data.json'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [mockRole, setMockRole] = useState('customer'); // Utilisé pour le test

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    // 1. Détermine les données de test à partir du JSON
    const targetAuthData = mockRole === 'customer' 
                        ? MockData.auth.client_success 
                        : MockData.auth.provider_success;

    const targetEmail = targetAuthData.user.email;
    const testPassword = "1234"; // Mot de passe de test standard

    // Simule la latence du réseau (1 seconde)
    setTimeout(() => {
        
        if (email === targetEmail && password === testPassword) {
            
            // SUCCÈS : Mise à jour du contexte et redirection
            login(targetAuthData); 
            
            if (mockRole === 'provider') {
                navigate('/prestataire/dashboard');
            } else {
                navigate('/profil');
            }
            
        } else {
            // ÉCHEC : Affichage de l'erreur
            setErrorMessage(`Login échoué. Utilisez ${targetEmail} / ${testPassword}.`);
        }
        
        setLoading(false);
        
    }, 1000); 
    // ----------------------------------------------------------
  };

  return (
    <div>
      
      {/* PARTIE 1 : CONNEXION (Formulaire) */}
      <div>
        <h2>Connexion</h2>
        
        {/* SÉLECTION DU RÔLE DE CONNEXION (Mock only) */}
        <div style={{ marginBottom: '15px', border: '1px dashed #ccc', padding: '10px' }}>
            <label htmlFor="mock-role">Simuler la connexion en tant que:</label>
            <select 
                id="mock-role"
                value={mockRole} 
                onChange={(e) => setMockRole(e.target.value)} 
                disabled={loading}
            >
                <option value="customer">Client ({MockData.auth.client_success.user.email} / 1234)</option>
                <option value="provider">Prestataire ({MockData.auth.provider_success.user.email} / 1234)</option>
            </select>
        </div>
        
        {errorMessage && <p>{errorMessage}</p>}
        
        <form onSubmit={handleSubmit}>
          {/* Champs Email et Password */}
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} style={{ width: '100%' }} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} style={{ width: '100%' }} />
          </div>

          <button type="submit" disabled={loading} >
            {loading ? 'Logging in...' : 'Se Connecter'}
          </button>
        </form>
      </div>

      {/* PARTIE 2 : INSCRIPTION (Liens) */}
      <div >
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