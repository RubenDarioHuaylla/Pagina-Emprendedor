import { useState, useEffect, useContext } from 'react';
import { StarIcon, FunnelIcon } from '@heroicons/react/24/outline';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function ReseñasEmprendedor() {
  const { usuario } = useContext(AuthContext);
  const [reseñas, setReseñas] = useState([]);
  const [stats, setStats] = useState({
    promedio: 0,
    total_reseñas: 0,
    cinco_estrellas: 0,
    cuatro_estrellas: 0,
    tres_estrellas: 0,
    dos_estrellas: 0,
    una_estrella: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tipo: 'todos',
    orden: 'recientes',
    valoracion: null
  });

  // Cargar reseñas
  useEffect(() => {
    const cargarReseñas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get('/api/resenas/dashboard', { 
          params: filters, 
          headers: { Authorization: `Bearer ${usuario.token}` }
        });
        
        // Verificar estructura de respuesta
        if (!response.data || !response.data.data) {
          throw new Error('Formato de respuesta inválido');
        }

        const { data } = response.data;
        
        setReseñas(data.reseñas || []);
        setStats({
          promedio: data.stats?.promedio || 0,
          total_reseñas: data.stats?.total_reseñas || 0,
          cinco_estrellas: data.stats?.cinco_estrellas || 0,
          cuatro_estrellas: data.stats?.cuatro_estrellas || 0,
          tres_estrellas: data.stats?.tres_estrellas || 0,
          dos_estrellas: data.stats?.dos_estrellas || 0,
          una_estrella: data.stats?.una_estrella || 0
        });

      } catch (error) {
        console.error("Error cargando reseñas:", error);
        setError('Error al cargar las reseñas');
        setReseñas([]);
        setStats({
          promedio: 0,
          total_reseñas: 0,
          cinco_estrellas: 0,
          cuatro_estrellas: 0,
          tres_estrellas: 0,
          dos_estrellas: 0,
          una_estrella: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (usuario?.token) {
      cargarReseñas();
    }
  }, [filters, usuario?.token]);

  // Manejar cambio de filtros
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //texto estrellas
  const textoEstrellas = {
  5: 'cinco_estrellas',
  4: 'cuatro_estrellas',
  3: 'tres_estrellas',
  2: 'dos_estrellas',
  1: 'una_estrella'
};


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header y filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Reseñas Recibidas</h1>
        <div className="flex flex-wrap gap-2">
          <select 
            className="border rounded px-3 py-2 text-sm"
            value={filters.tipo}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="producto">Productos</option>
            <option value="servicio">Servicios</option>
            <option value="emprendimiento">Emprendimiento</option>
          </select>
          
          <select 
            className="border rounded px-3 py-2 text-sm"
            value={filters.orden}
            onChange={(e) => handleFilterChange('orden', e.target.value)}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguas">Más antiguas</option>
            <option value="mejores">Mejor valoradas</option>
            <option value="peores">Peor valoradas</option>
          </select>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FunnelIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="col-span-2 md:col-span-1 border-r pr-4">
          <p className="text-3xl font-bold">{stats.promedio.toFixed(1)}</p>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon 
                key={star}
                className={`h-4 w-4 ${star <= Math.round(stats.promedio) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({stats.total_reseñas})</span>
          </div>
          <p className="text-sm text-gray-500">Promedio</p>
        </div>
        
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="text-center">
            <div className="flex justify-center items-center">
              {Array(rating).fill().map((_, i) => (
                <StarIcon key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-lg font-semibold">
              {stats[textoEstrellas[rating]] || 0}
            </p>
            <p className="text-xs text-gray-500">reseñas</p>
          </div>
        ))}
      </div>

      {/* Lista de reseñas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p>Cargando reseñas...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : reseñas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No hay reseñas que coincidan con los filtros</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {reseñas.map((reseña) => (
              <li key={reseña.id_comentario} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="bg-gray-200 text-gray-600 h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    {reseña.cliente_nombre?.charAt(0)?.toUpperCase() || ''}
                    {reseña.cliente_apellido?.charAt(0)?.toUpperCase() || ''}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {reseña.cliente_nombre || 'Anónimo'} {reseña.cliente_apellido || ''}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(reseña.fecha_comentario).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${star <= (reseña.valoracion || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mt-2 whitespace-pre-line">{reseña.comentario || 'Sin comentario'}</p>
                    
                    {reseña.tipo === 'producto' && reseña.tipo_oferta === 'producto' && reseña.producto_nombre && (
                      <p className="text-sm text-gray-500 mt-2">
                        Sobre el producto: <span className="font-medium">{reseña.producto_nombre}</span>
                      </p>
                    )}

                    {reseña.tipo === 'producto' && reseña.tipo_oferta === 'servicio' && reseña.producto_nombre && (
                      <p className="text-sm text-gray-500 mt-2">
                        Sobre el Servicio: <span className="font-medium">{reseña.producto_nombre}</span>
                      </p>
                    )}
                    
                    {reseña.tipo === 'emprendimiento' && (
                      <p className="text-sm text-gray-500 mt-2">
                        Sobre el emprendimiento
                      </p>
                    )}


                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}