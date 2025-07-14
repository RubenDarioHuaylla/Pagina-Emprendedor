import API from './axios';

export const loginUsuario = async (email, password) => {
  const res = await API.post('/api/auth/login', { email, password });
  return res.data;
};



