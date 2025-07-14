import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import API from "../api/axios";

export default function DetalleProductoSoloVista({ id }) {
  const [producto, setProducto] = useState(null);
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await API.get(`/api/productos/mis-productos/${id}`);
        setProducto(res.data.data.info);
        setReseñas(res.data.data.reseñas || []);
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const renderEstrellas = (valoracion) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-5 w-5 ${
              star <= valoracion
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!producto) {
    return <div className="text-center py-12 text-gray-600">No se encontró el producto</div>;
  }

  const imagenSrc = producto.imagen_url
    ? `http://localhost:4000${producto.imagen_url}`
    : "/default-producto.jpg";

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Contenido principal */}
      <div className="md:flex">
        {/* Imagen del producto (ajustada) */}
        <div className="md:w-2/5 bg-gray-50 flex items-center justify-center p-4">
          <img
            src={imagenSrc}
            alt={producto.nombre}
            className="max-h-64 object-contain rounded"
            onError={(e) => {
              e.target.src = "/default-producto.jpg";
              e.target.className = "max-h-64 object-contain p-4 rounded bg-gray-50";
            }}
          />
        </div>

        {/* Información del producto (más compacta) */}
        <div className="md:w-3/5 p-5">
          <h1 className="text-2xl font-bold text-gray-800">{producto.nombre}</h1>
          
          <div className="flex items-center mt-2 mb-3">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
              {producto.categoria}
            </span>
            <div className="flex items-center">
              {renderEstrellas(Math.round(producto.promedio_valoracion || 0))}
              <span className="ml-1 text-sm text-gray-500">
                ({producto.total_reseñas})
              </span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-2xl font-bold text-gray-900">S/ {producto.precio}</span>
            {producto.unidad_medida && (
              <span className="text-gray-500 ml-1 text-sm">/ {producto.unidad_medida}</span>
            )}
          </div>

          {/* Descripciones mejor diferenciadas */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Descripción:</h3>
              <p className="text-gray-700 text-sm">{producto.descripcion_corta}</p>
            </div>
            
            {producto.descripcion_larga && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Detalles:</h3>
                <p className="text-gray-700 text-sm">{producto.descripcion_larga}</p>
              </div>
            )}
          </div>

          {/* Vendedor compacto */}
          <div className="flex items-center mt-4 pt-3 border-t">
            <img
              src={producto.logo_negocio || "/default-logo.jpg"}
              alt={producto.nombre_negocio}
              className="w-8 h-8 rounded-full object-cover border"
              onError={(e) => {
                e.target.src = "/default-logo.jpg";
              }}
            />
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-700">{producto.nombre_negocio}</p>
              <p className="text-xs text-gray-500">
                Publicado el {new Date(producto.fecha_publicacion).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de reseñas ajustada */}
      <div className="border-t px-5 py-4 bg-gray-50">
        <h3 className="font-semibold text-gray-800 mb-3">Reseñas</h3>
        
        {reseñas.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-2">Este producto no tiene reseñas aún</p>
        ) : (
          <div className="space-y-3">
            {reseñas.map((reseña) => (
              <div key={reseña.id_comentario} className="text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-700">
                      {reseña.cliente_nombre} {reseña.cliente_apellido}
                    </p>
                    <div className="flex items-center mt-1">
                      {renderEstrellas(reseña.valoracion)}
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(reseña.fecha_comentario).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
                {reseña.comentario && (
                  <p className="mt-1 text-gray-600 pl-1 italic">"{reseña.comentario}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}