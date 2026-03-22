import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api', // URL de ton backend
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