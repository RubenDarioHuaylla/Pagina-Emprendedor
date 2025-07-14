// src/components/RutaSoloSiTieneEmprendimiento.jsx
import { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

export default function RutaSoloSiTieneEmprendimiento({ children }) {
  const { usuario } = useContext(AuthContext);
  const [permitido, setPermitido] = useState(null); // null = cargando

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await API.get('/api/emprendimientos/verificar', {
          headers: { Authorization: `Bearer ${usuario.token}` },
        });
        setPermitido(res.data.hayEmpredimiento);
      } catch (e) {
        setPermitido(false); // error = no pasar
        console.log('error', e)
      }
    };
    verificar();
  }, [usuario]);

  if (permitido === null) return <p className="text-center mt-10">Verificando emprendimiento...</p>;

  return permitido ? children : <Navigate to="/panel/emprendimiento" />;
}
