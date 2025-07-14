import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import { StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {toast} from 'react-toastify';

export default function ProductoDetail({ id, onClose }) { 
  const [producto, setProducto] = useState(null);
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuario } = useContext(AuthContext); 
  const [mostrarModalComentar, setMostrarModalComentar] = useState(false);
  const [yaComento, setYaComento] = useState(false);

    const recargarReseñas = async () => {
    try {
      const res = await API.get(`/api/productos/${id}`);
      setReseñas(res.data.data.reseñas || []);
      setYaComento(true);
    } catch (error) {
      console.error("Error recargando reseñas:", error);
    }
  };


  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resProd = await API.get(`/api/productos/${id}`);
        setProducto(resProd.data.data.info);
        setReseñas(resProd.data.data.reseñas || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    const verificarResena = async () => {
    if (usuario) {
      try {
        const res = await API.get(`/api/resenas/verificar`, {
          params: {
            tipo: 'producto',
            id,
          },
        });
        setYaComento(res.data.yaComento);
      } catch (err) {
        console.error("Error verificando reseña:", err);
      }
    }
  };
    cargarDatos();
    verificarResena()
  }, [id, usuario]);

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (!producto) return <div className="text-center py-8">Producto no encontrado</div>;

  const imagenSrc = producto.imagen_url 
    ? `http://localhost:4000${producto.imagen_url}` 
    : '/default-producto.jpg';
  
  const logoNegocio = producto.logo_negocio 
    ? producto.logo_negocio.startsWith('http') 
      ? producto.logo_negocio 
      : `http://localhost:4000${producto.logo_negocio}`
    : '/default-logo.jpg';

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

return (
    <div className="p-4 md:p-6 relative max-w-6xl mx-auto">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Cerrar"
        >
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Tarjeta principal */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Sección de imagen */}
          <div className="md:w-2/5 relative">
            <div className="aspect-w-4 aspect-h-3 bg-gray-100">
              <img 
                src={imagenSrc} 
                alt={producto.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-producto.jpg';
                  e.target.className = 'w-full h-full object-contain p-8';
                }}
              />
            </div>
            {producto.promedio_valoracion > 0 && (
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center shadow-sm">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="ml-1 font-medium text-gray-800">
                  {(producto.promedio_valoracion).toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          {/* Sección de información */}
          <div className="p-6 md:w-3/5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{producto.nombre}</h1>
                <p className="text-gray-600 mt-1">{producto.categoria}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                producto.tipo_categoria === 'producto' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {producto.tipo_categoria === 'producto' ? 'Producto' : 'Servicio'}
              </span>
            </div>
            
            {/* Precio */}
            <div className="my-6">
              <span className="text-3xl font-bold text-gray-900">S/ {producto.precio}</span>
              {producto.unidad_medida && (
                <span className="text-gray-500 ml-2">/ {producto.unidad_medida}</span>
              )}
            </div>
            
            {/* Descripción */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Descripción</h2>
              <p className="text-gray-700">{producto.descripcion_corta}</p>
              {producto.descripcion_larga && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{producto.descripcion_larga}</p>
                </div>
              )}
            </div>
            
            {/* Negocio */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ofrecido por:</h3>
              <Link 
                to={`/emprendimientos/${producto.id_emprendimiento}`}
                className="flex items-center hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClose) onClose();
                }}
              >
                <div className="relative">
                  <img 
                    src={logoNegocio} 
                    alt={producto.nombre_negocio}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.src = '/default-logo.jpg';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-blue-600 hover:underline font-medium">
                    {producto.nombre_negocio}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Publicado el {formatDate(producto.fecha_publicacion)}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Sección de reseñas */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Comentarios</h2>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 font-medium">{(producto.promedio_valoracion ?? 0).toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-2">({producto.total_reseñas} reseñas)</span>
            </div>
          </div>
          
          {reseñas.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="mt-3 text-gray-500">No hay reseñas aún</p>
              <p className="text-sm text-gray-400 mt-1">Sé el primero en opinar</p>
            </div>
          ) : (
            <div className="space-y-5">
              {reseñas.map((reseña) => (
                <div key={reseña.id_comentario} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0 font-medium text-gray-700">
                      {reseña.cliente_nombre.charAt(0)}{reseña.cliente_apellido.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {reseña.cliente_nombre} {reseña.cliente_apellido}
                          </h4>
                          <div className="flex items-center mt-1">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={`h-4 w-4 ${star <= reseña.valoracion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(reseña.fecha_comentario)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-700 leading-relaxed">{reseña.comentario}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Sección para comentar */}
          <div className="mt-8 pt-6 border-t">
            {!usuario ? (
              <div className="text-center">
                <button
                  onClick={() => toast.error("Debes iniciar sesión para poder comentar.")}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Escribir reseña
                </button>
              </div>
            ) : yaComento ? (
              <div className="text-center py-4 bg-blue-50 rounded-lg">
                <p className="text-blue-600 font-medium">¡Gracias por tu reseña!</p>
                <p className="text-sm text-gray-500 mt-1">Ya has opinado sobre este producto</p>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setMostrarModalComentar(true)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Escribir reseña
                </button>

                {mostrarModalComentar && (
                  <Modal onClose={() => setMostrarModalComentar(false)}>
                    <div className="p-1">
                      <h2 className="text-xl font-bold mb-4 text-gray-800">Escribe tu reseña</h2>
                      <ReviewForm
                        targetId={id}
                        targetType="producto"
                        onSuccess={() => {
                          recargarReseñas();
                          setMostrarModalComentar(false);
                        }}
                      />
                    </div>
                  </Modal>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-5 w-5 text-gray-700" />
        </button>
        {children}
      </div>
    </div>
  );
}
