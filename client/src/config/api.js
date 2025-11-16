// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    ressources: '/api/ressources',
    ressourcesAll: '/api/ressources/all',
    companies: '/api/companies',
    clients: '/api/clients',
    deleteRessource: (id) => `/api/ressources/delete/${id}`,
    updateRessource: (id) => `/api/ressources/update/${id}`,
    companyEmployees: (company) => `/api/company/employees/${company}`,
    health: '/api/health',
  }
};

// Fonction utilitaire pour faire des appels API
export const fetchAPI = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur serveur' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default apiConfig;

