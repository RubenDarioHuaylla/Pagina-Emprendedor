// 2/07/2025

import { Link, NavLink,  } from 'react-router-dom';


// Componente Sidebar
function SidebarEmprendedor() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          {/* Logo y nombre */}
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-lg font-semibold text-gray-900">Mi Emprendimiento</h1>
          </div>
          
          {/* Navegación */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <NavLink 
              to="/panel" 
              end
              className={({isActive}) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Resumen
            </NavLink>
            
            <NavLink 
              to="/panel/emprendimiento" 
              className={({isActive}) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Mi Negocio
            </NavLink>
            
            <NavLink 
              to="/panel/productos" 
              className={({isActive}) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos/Servicios
            </NavLink>
            
            <NavLink 
              to="/panel/comentarios" 
              className={({isActive}) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comentarios
            </NavLink>
            
            <NavLink 
              to="/panel/estadisticas" 
              className={({isActive}) => `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary-100 text-primary-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <svg className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Estadísticas
            </NavLink>
          </nav>
        </div>
        
        {/* Footer del sidebar */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link to="/" className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <svg className="h-6 w-6 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ver tienda pública</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SidebarEmprendedor;