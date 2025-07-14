import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsuario({ ...decoded, token });
      } catch (err) {
        console.error("❌ Token inválido en useEffect:", err);
        localStorage.removeItem('token'); // Limpia el token roto
        setUsuario(null);
      }
    }
  }, []);

  const login = (data) => {
    try {
      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);
      setUsuario({ ...decoded, token: data.token });
    } catch (err) {
      console.error("❌ Token inválido en login:", err);
      localStorage.removeItem('token');
      setUsuario(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
