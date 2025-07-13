// 2/07/202
import  { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Componente Header
function HeaderPanel() {
  const { usuario, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/loginForm');
  }
  
  return (
    <div className="bg-white shadow-sm">
      <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-lg font-semibold leading-6 text-gray-900">Panel de Control</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Hola, {usuario?.nombre} 👤</span>
          <button 
            onClick= {handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderPanel;