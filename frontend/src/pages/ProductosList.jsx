import { useState, useEffect } from 'react';
import API from '../api/axios';
import { StarIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';
import { Range} from 'react-range'
import ProductoDetail from './ProductoDetail';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Añade esto al inicio


export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const [filters, setFilters] = useState({
    search: '',
    tipo: 'todos',
    categoria: 'todas',
    orden: 'recientes',
    precio_min: undefined,
    precio_max: undefined
  });

  // Cargar categorías al montar el componente
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await API.get('/api/categorias');
        setCategorias(response.data || []);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    cargarCategorias();
  }, []);

  // Cargar productos con filtros
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        
        // Preparar parámetros para la API
        const params = {
          q: filters.search || undefined,
          tipo: filters.tipo === 'todos' ? undefined : filters.tipo,
          categoria: filters.categoria === 'todas' ? undefined : filters.categoria,
          orden: filters.orden,
          precio_min: filters.precio_min !== '' ? Number(filters.precio_min) : undefined,
          precio_max: filters.precio_max !== '' ? Number(filters.precio_max) : undefined
        };

        // Eliminar parámetros undefined
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
        const response = await API.get('/api/productos', { params });
        setProductos(response.data.data || []);
        
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(() => cargarProductos(), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  
  return (
    <div className = "min-h-screen flex flex-col">
      <Navbar />
    <main className="flex-grow bg-gray-50">

    <div className="max-w-7xl mx-auto px-4 py-8">
      
      
      {/* Filtros mejorados */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Productos y Servicios</h1>
          
          <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.tipo}
              onChange={(e) => setFilters({...filters, tipo: e.target.value})}
            >
              <option value="todos">Todos</option>
              <option value="producto">Productos</option>
              <option value="servicio">Servicios</option>
            </select>
            
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.categoria}
              onChange={(e) => setFilters({...filters, categoria: e.target.value})}
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.nombre}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filtro de rango de precios */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Rango de precios (S/)</h3>
          
          <Range
            step={10}
            min={0}
            max={5000}
            values={[filters.precio_min ?? 0, filters.precio_max ?? 5000]}
            onChange={(values) => {
              setFilters({
                ...filters,
                precio_min: values[0],
                precio_max: values[1]
              });
            }}
            renderTrack={({ props, children }) => {
              // Extraemos la key de props para no pasarla en el spread
              const { key, ...trackProps } = props;
              return (
                <div
                  key={key} // Pasamos la key directamente
                  {...trackProps} // Spread sin la key
                  className="h-2 bg-gray-200 rounded-full w-full my-4"
                >
                  <div
                    className="h-2 bg-blue-500 rounded-full absolute"
                    style={{
                      left: `${props.style.left}%`,
                      width: `${props.style.width}%`
                    }}
                  />
                  {children}
                </div>
              );
            }}
            renderThumb={({ props, isDragged }) => {
              // Extraemos la key de props para no pasarla en el spread
              const { key, ...thumbProps } = props;
              return (
                <div
                  key={key} // Pasamos la key directamente
                  {...thumbProps} // Spread sin la key
                  className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center focus:outline-none ${
                    isDragged ? 'bg-blue-600' : 'bg-blue-500'
                  }`}
                >
                  <div className="absolute -top-8 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                    S/ {props['aria-valuenow']}
                  </div>
                </div>
              );
            }}
          />
          
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>S/ {filters.precio_min}</span>
            <span>S/ {filters.precio_max}</span>
          </div>
            <button
            onClick={() => {
              setFilters((prev) => ({
                ...prev,
                precio_min: undefined,
                precio_max: undefined
              }));
            }}
            className="mt-2 text-blue-600 hover:underline text-sm"
          >
            Mostrar todos los precios
          </button>


        </div>
  
       
        {/* Ordenamiento */}
        <div className="flex justify-end">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={filters.orden}
            onChange={(e) => setFilters({...filters, orden: e.target.value})}
          >
            <option value="recientes">Más recientes</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="valoracion_desc">Mejor valorados</option>
          </select>
        </div>
      </div>

      {/* Listado de productos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No se encontraron productos con los filtros seleccionados</p>
          <button 
            onClick={() => setFilters({
              search: '',
              tipo: 'todos',
              categoria: 'todas',
              orden: 'recientes',
              precio_min: 0,
              precio_max: 1000
            })}
            className="mt-4 text-blue-600 hover:underline"
          >
            Reiniciar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => {
            const imagenSrc = producto.imagen_url
              ? `http://localhost:4000${producto.imagen_url}`
              : '/default-producto.jpg';

            return (
              <div key={producto.id_producto_servicio} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imagenSrc}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-producto.jpg';
                    }}
                  />
                  {producto.promedio_valoracion > 0 && (
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-xs font-medium">
                        {producto.promedio_valoracion.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{producto.nombre}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      producto.tipo_categoria === 'producto' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {producto.tipo_categoria === 'producto' ? 'Producto' : 'Servicio'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{producto.categoria}</p>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{producto.descripcion_corta}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">S/ {producto.precio}</span>
                    
                    <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevenir eventos del padre
                          setSelectedProduct(producto);
                        }}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Ver
                      </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </main>
      {/* Modal de detalle del producto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
            <ProductoDetail 
              id={selectedProduct.id_producto_servicio} 
              onClose={() => setSelectedProduct(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}