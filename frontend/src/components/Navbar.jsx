import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



export default function Navbar() {
  const { usuario, logout} = useContext(AuthContext);
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-primary-600">EmprendeLocal</div>
        <nav className="hidden md:flex space-x-8">
          <a href="/" className="text-gray-700 hover:text-primary-600">Inicio</a>
          <a href="/observar" className="text-gray-700 hover:text-primary-600">Explorar</a>
          <a href="/ofertas" className="text-gray-700 hover:text-primary-600">Productos y Servicios </a>

          {usuario ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">👋 Hola, {usuario.nombre}</span>
              <button 
                onClick={logout}
                className="text-red-600 hover:underline"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <a href="/loginForm" className="text-gray-700 hover:text-primary-600">Iniciar Sesión</a>
              <a href="/registro" className="text-gray-700 hover:text-primary-600">Registrarse</a>
            </>
          )}

        </nav>
        <button className="md:hidden">☰</button>
      </div>
    </header>
  )
}