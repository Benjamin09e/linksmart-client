import axios from 'axios';


const api = axios.create({
  baseURL: 'https://linksmart-api.onrender.com/api',
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