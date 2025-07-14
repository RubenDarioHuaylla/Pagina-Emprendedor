import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import { StarIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import ProductoDetail from './ProductoDetail';

export default function EmprendimientoDetail() {
  const { id } = useParams();
  const [emprendimiento, setEmprendimiento] = useState(null);
  const [productos, setProductos] = useState([]);
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { usuario } = useContext(AuthContext);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [yaComento, setYaComento] = useState(false); // para manejar si ya comentó
  const [productoModal, setProductoModal] = useState(null);

   const recargarReseñas = async () => {
    try {
      const res = await API.get(`/api/emprendimientos/${id}`);
      const { reseñas: nuevasReseñas } = res.data.data;
      setReseñas(nuevasReseñas);
      setYaComento(true);
      } catch (error) {
        console.error("Error recargando reseñas:", error);
      }
    };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await API.get(`/api/emprendimientos/${id}`);
        const {info, productos, reseñas} = res.data.data;
        
        setEmprendimiento(info);
        setProductos(productos);
        setReseñas(reseñas);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    const verificarResena = async () => {
    if (usuario) {
      try {
      const resVerificacion = await API.get(`/api/resenas/verificar`, {
          params: {
            tipo: 'emprendimiento',
            id,
          },
        });
        setYaComento(resVerificacion.data.yaComento);
      } catch (err) {
        console.error("Error verificando si ya comentó:", err);
      }
    }
  };

  cargarDatos();
  verificarResena();
}, [id, usuario]); 
  

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!emprendimiento) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Emprendimiento no encontrado</h1>
        <Link to="/emprendimientos" className="text-blue-600 hover:underline">
          Volver a la lista de emprendimientos
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header del emprendimiento */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4">
            <img 
              src={emprendimiento.logo_url || '/default-emprendimiento.jpg'} 
              alt={emprendimiento.nombre_negocio}
              className="w-full h-64 md:h-full object-cover"
              onError={(e) => {
                e.target.src = '/default-emprendimiento.jpg';
              }}
            />
          </div>
          
          <div className="p-6 md:w-2/3 lg:w-3/4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{emprendimiento.nombre_negocio}</h1>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide mt-2">
                  {emprendimiento.rubro}
                </span>
              </div>
              
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="ml-1 font-medium">{(emprendimiento.promedio_valoracion ?? 0).toFixed(1)}</span>
                <span className="text-sm text-gray-500 ml-2">({emprendimiento.total_reseñas})</span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              {emprendimiento.direccion && (
                <span className="flex items-center text-sm text-gray-600">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {emprendimiento.direccion}
                </span>
              )}
              
              {emprendimiento.telefono_contacto && (
                <a href={`tel:${emprendimiento.telefono_contacto}`} className="flex items-center text-sm text-blue-600 hover:underline">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {emprendimiento.telefono_contacto}
                </a>
              )}
            </div>
            
            <p className="text-gray-700 mt-4 leading-relaxed">{emprendimiento.descripcion}</p>
            
            <div className="mt-6 flex space-x-4">
              {emprendimiento.whatsapp_url && (
                <a href={emprendimiento.whatsapp_url} target="_blank" rel="noopener noreferrer" className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center text-sm font-medium">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-6.29 3.617c-.545.244-1.294.375-2.155.375-1.89 0-3.42-1.305-3.42-2.915 0-.805.375-1.504.988-1.933.272-.195.676-.414.676-.414s-.198-.248-.297-.396c-.1-.149-.174-.273-.174-.273l-.422.555s-.322.396-.471.61c-.15.212-.297.579-.297.966 0 .744.546 1.861 1.664 2.562.744.465 1.74.695 2.82.695.744 0 1.416-.11 1.958-.285.173-.06.322-.124.322-.124l-.124-.347s-.347-.099-.744-.223" />
                  </svg>
                  WhatsApp
                </a>
              )}
              
              {emprendimiento.facebook_url && (
                <a href={emprendimiento.facebook_url} target="_blank" rel="noopener noreferrer" className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center text-sm font-medium">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de productos/servicios */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Productos y Servicios</h2>
          <div className="text-sm text-gray-500">
            Mostrando {productos.length} {productos.length === 1 ? 'item' : 'items'}
          </div>
        </div>
        
        {productos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No hay productos disponibles</h3>
            <p className="mt-1 text-sm text-gray-500">Este emprendimiento aún no ha agregado productos o servicios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => {
              const imagenSrc = producto.imagen_url
                ? `http://localhost:4000${producto.imagen_url}`
                : '/default-producto.jpg';

              return (
                <div key={producto.id_producto_servicio} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <img 
                      src={imagenSrc} 
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-producto.jpg';
                      }}
                    />
                    {producto.estado === 'disponible' && (
                      <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Disponible
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">{producto.nombre}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {producto.categoria}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {producto.descripcion_corta || producto.descripcion_larga}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">S/ {producto.precio}</span>
                      
                      <button
                        onClick={() => setProductoModal(producto.id_producto_servicio)}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Ver más
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sección de reseñas */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reseñas sobre el Negocio</h2>
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 font-medium">{(emprendimiento.promedio_valoracion ?? 0).toFixed(1)}</span>
              <span className="text-sm text-gray-500 ml-2">({emprendimiento.total_reseñas} {emprendimiento.total_reseñas === 1 ? 'reseña' : 'reseñas'})</span>
            </div>
          </div>
          
          {reseñas.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No hay reseñas aún</h3>
              <p className="mt-1 text-sm text-gray-500">Sé el primero en compartir tu experiencia.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reseñas.map((reseña) => (
                <div key={reseña.id_comentario} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-600 font-medium">
                      {reseña.cliente_nombre.charAt(0)}{reseña.cliente_apellido.charAt(0)}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {reseña.cliente_nombre} {reseña.cliente_apellido}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(reseña.fecha_comentario).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${star <= reseña.valoracion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600">{reseña.comentario}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}


          {/* Formulario de reseña */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {!usuario ? (
              <button
                onClick={() => alert("Debes iniciar sesión para poder comentar.")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Escribir reseña
              </button>
            ) : yaComento ? (
              <p className="text-gray-600 italic">Ya has dejado una reseña para este emprendimiento.</p>
            ) : (
              <>
                <button
                  onClick={() => setMostrarModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Escribir reseña
                </button>

                {mostrarModal && (
                <Modal onClose={() => setMostrarModal(false)}>
                <h2 className="text-xl font-bold mb-4">Escribe tu reseña</h2>
                <ReviewForm 
                  targetId={id}
                  targetType="emprendimiento" // ← Única diferencia clave
                  onSuccess={() => {
                    recargarReseñas();
                    setMostrarModal(false);
                  }}
                />
              </Modal>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {productoModal && (
      <ProductoModal 
     id={productoModal}
      onClose={() => setProductoModal(null)}
     />
      )}

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


function ProductoModal({ id, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 z-10">
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        </button>
        <ProductoDetail id={id} onClose={onClose} />
      </div>
    </div>
  );
}