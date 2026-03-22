import axios from 'axios';


const api = axios.create({
    // Si on est sur Netlify, il lira l'URL de Render, sinon il utilisera localhost
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api',
});

// Ajout du token automatique s'il existe
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;