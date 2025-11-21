// src/mocks/mockData.js

// ------------------------------------
// 1. DONNÉES UTILISATEUR ET PRESTATAIRE (Pour la Connexion/Profil)
// Basé sur les tables 'customers' et 'service_providers'
// ------------------------------------

export const MOCKED_AUTH_CLIENT = {
  user: {
    id_customer: 1,
    name: "Dev",
    firstname: "Chaymaa",
    email: "test.client@aura.com",
    phone_number: "0610101010",
    address: "12 Rue des Clients, 75000 Paris",
    sex: "F",
    // Champ Front-end pour l'identification
    role: "customer",
  },
  token: "MOCKED_JWT_TOKEN_CLIENT_AURA",
};

export const MOCKED_AUTH_PROVIDER = {
  user: {
    id_provider: 101,
    name: "Tech",
    firstname: "Sam",
    email: "test.pro@aura.com",
    phone_number: "0720202020",
    address: "24 Rue des Pros, 13000 Marseille",
    sex: "M",
    SIREN: "123456789",
    statut: "Micro-entreprise",
    education_experience: "Diplômé en plomberie et électricité",
    // Champ Front-end pour l'identification
    role: "provider",
  },
  token: "MOCKED_JWT_TOKEN_PROVIDER_AURA",
};

// ------------------------------------
// 2. DONNÉES DES SERVICES (Tâche B1)
// Basé sur la table 'offers'
// ------------------------------------
export const MOCKED_SERVICES = [
  {
    id_offer: 10,
    description: "Nettoyage approfondi de cuisine et salon (3 heures).",
    price: 85.5,
    duration: "3 heures",
    category: "Ménage",
    disponibility: "Lun - Ven",
    perimeter_of_displacement: "10km",
  },
  {
    id_offer: 11,
    description: "Massage relaxant à domicile (60 minutes).",
    price: 65.0,
    duration: "1h",
    category: "Massage",
    disponibility: "Sam - Dim",
    perimeter_of_displacement: "5km",
  },
  {
    id_offer: 12,
    description: "Baby-sitting soirée (après 18h).",
    price: 15.0,
    duration: "Par heure",
    category: "Garde_denfant",
    disponibility: "Tous les soirs",
    perimeter_of_displacement: "15km",
  },
];

// ------------------------------------
// 3. DONNÉES WISHLIST (Tâche D1)
// Liste des offres favorites d'un client
// ------------------------------------
export const MOCKED_WISHLIST = [
  {
    id_favOffer: 1,
    id_offer: 10,
    description: "Nettoyage approfondi de cuisine et salon (3 heures).",
    price: 85.5,
    category: "Ménage",
  },
  {
    id_favOffer: 2,
    id_offer: 12,
    description: "Baby-sitting soirée (après 18h).",
    price: 15.0,
    category: "Garde_denfant",
  },
];
