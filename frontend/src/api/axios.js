import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// Interceptor para añadir automáticamente el token a las peticiones
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // token guardado al hacer login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default API;