import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { StarIcon } from '@heroicons/react/24/solid'; // Cambiado a solid para mejor visibilidad
import { MagnifyingGlassIcon, FunnelIcon, BarsArrowDownIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
//import SkeletonLoader from '../components/SkeletonLoader'; // Componente para loading skeleton

export default function EmprendimientosList() {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rubros, setRubros] = useState([])
  const [loadingRubros, setLoadingRubros] = useState(true);
  const [filters, setFilters] = useState({
    nombre: '',
    rubro: '',
    valoracion_min: '',
    orden: 'valoracion_desc'
  });

  // Cargar rubros al montar el componente
  useEffect(() => {
    const cargarRubros = async () => {
      try {
        const response = await API.get('/api/rubros');
        setRubros(response.data || []);
      } catch (error) {
        console.error("Error cargando rubros:", error);
      } finally {
        setLoadingRubros(false);
      }
    };
    cargarRubros();
  }, []);


  useEffect(() => {
    const cargarEmprendimientos = async () => {
      try {
        setLoading(true);
        // Preparamos los parámetros para el backend
        const params = {
          nombre: filters.nombre || undefined,
          rubro: filters.rubro || undefined,
          orden: filters.orden || undefined
        };
        
        // Limpiamos parámetros undefined
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
        

        const response = await API.get('/api/emprendimientos', { params: filters });
        console.log("Respuesta de la API:", response);
        console.log("Datos recibidos:", response.data);

        setEmprendimientos(response.data.data || []);
      } catch (error) {
        console.error("Error cargando emprendimientos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => cargarEmprendimientos(), 300); // Debounce para búsqueda
    return () => clearTimeout(timer);
  }, [filters]);

  const handleSearchChange = (e) => setFilters({...filters, nombre: e.target.value});
  const handleRubroChange = (e) => setFilters({...filters, rubro: e.target.value});
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header y Filtros */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Descubre Emprendimientos</h1>
            
            <div className="w-full md:w-auto flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar nombre..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={filters.rubro}
                  onChange={handleRubroChange}
                  disabled = {loadingRubros}
                >
                  <option value="todos">Todos los rubros</option>
                  {/* Opciones de rubros dinámicas */}
                  {rubros.map((rubro) => (
                  <option key={rubro.id_rubro} value={rubro.nombre}>
                   {rubro.nombre}
                  </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BarsArrowDownIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={filters.orden}
                  onChange={(e) => setFilters({...filters, orden: e.target.value})}
                >
                  <option value="recientes">Más recientes</option>
                  <option value="valoracion_desc">Mejor valorados</option>
                  <option value="nombre_asc">A-Z</option>
                  <option value="nombre_desc">Z-A</option>
                </select>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600">
            Mostrando {emprendimientos.length} emprendimientos
          </p>
        </div>

        {/* Lista de Emprendimientos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : emprendimientos.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <MagnifyingGlassIcon />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron emprendimientos</h3>
            <p className="mt-1 text-sm text-gray-500">Intenta ajustando tus filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emprendimientos.map((emp) => (
              <div 
                key={emp.id_emprendimiento} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 w-full">
                  <img 
                    src={emp.logo_url || '/default-emprendimiento.jpg'} 
                    alt={emp.nombre_negocio}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-emprendimiento.jpg';
                    }}
                  />
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow-sm">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      <span className="ml-1 text-xs font-medium">
                        {emp.promedio_valoracion.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{emp.nombre_negocio}</h2>
                      <p className="text-sm text-gray-500 mt-1">{emp.rubro}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Link 
                      to={`/emprendimientos/${emp.id_emprendimiento}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Ver detalles
                    </Link>
                    
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {emp.ciudad || 'Online'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente SkeletonLoader para el estado de carga
function SkeletonLoader() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-48 w-full"></div>
      <div className="p-5">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}