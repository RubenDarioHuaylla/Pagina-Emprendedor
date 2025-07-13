// 2/07/2025
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios'; // Asegúrate de tener configurada tu API
import DetalleProductoServicio from '../components/DetalleVista_PS';
import { XMarkIcon } from '@heroicons/react/24/outline';
// Componente específico para Productos (que iría en /panel/productos)
export default function MisProductos() {
  const { usuario } = useContext(AuthContext);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modo, setModo] = useState('listar');
  const [productoEditarId, setProductoEditarId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion_corta: '',
    descripcion_larga: '',
    precio: '',
    unidad_medida: '',
    tipo_oferta: '',
    estado: 'disponible',
    id_categoria: '',
    imagen_url: ''
  });
  const [error, setError] = useState('');
  // PARA DETALLES
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);


  // Cargar categorías y productos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resCategorias, resProductos] = await Promise.all([
          API.get('/api/categorias', {
            headers: { Authorization: `Bearer ${usuario.token}` },
          }),
          API.get('/api/productos/mis-productos', {
            headers: { Authorization: `Bearer ${usuario.token}` },
          })
        ]);
        
        setCategorias(resCategorias.data);
        setProductos(resProductos.data);
      } catch (error) {
        console.error('Error al cargar datos', error);
        setError('Error al cargar los datos');
      }
    };
    
    cargarDatos();
  }, [usuario.token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!form.tipo_oferta.trim()){
      setError('El nombre es requerido');
      return false;
    }
    if (!form.precio || isNaN(form.precio)) {
      setError('El precio debe ser un número válido');
      return false;
    }
    if (!form.id_categoria) {
      setError('Debes seleccionar una categoría');
      return false;
    }
    return true;
  };

  const crearProducto = async () => {
    if (!validarFormulario()) return;
    if (!archivoSeleccionado && form.tipo_oferta === 'producto' && modo === 'crear') {
      setError('Debes subir una imagen para productos');
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (archivoSeleccionado) formData.append("imagen", archivoSeleccionado);

      const res = await API.post("/api/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${usuario.token}`,
        },
      });

      setProductos([...productos, res.data.data]);
      setModo('listar');
      setError('');
    } catch (error) {
      console.error("Error al crear producto", error);
      setError(error.response?.data?.message || 'Error al crear producto');
    }
  };

  const actualizarProducto = async () => {
    if (!validarFormulario()) return;

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (archivoSeleccionado) formData.append("imagen", archivoSeleccionado);

      const res = await API.put(`/api/productos/${productoEditarId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${usuario.token}`,
        },
      });

      setProductos(productos.map(p => 
        p.id_producto_servicio === productoEditarId ? res.data.data : p
      ));
      setModo('listar');
      setError('');
    } catch (error) {
      console.error("Error al actualizar producto", error);
      setError(error.response?.data?.message || 'Error al actualizar producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await API.delete(`/api/productos/${id}`, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
      setProductos(productos.filter(p => p.id_producto_servicio !== id));
    } catch (err) {
      console.error('Error al eliminar producto', err);
      setError('Error al eliminar producto');
    }
  };

  const iniciarEdicion = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion_corta: producto.descripcion_corta,
      descripcion_larga: producto.descripcion_larga,
      precio: producto.precio,
      unidad_medida: producto.unidad_medida,
      tipo_oferta: producto.tipo_oferta || 'producto',
      estado: producto.estado,
      id_categoria: producto.id_categoria,
      imagen_url: producto.imagen_url
    });
    setProductoEditarId(producto.id_producto_servicio);
    setModo('editar');
    setArchivoSeleccionado(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold leading-tight text-gray-900">
          {modo === 'listar' ? 'Mis Productos/Servicios' : 
           modo === 'crear' ? 'Nuevo Producto/Servicio' : 'Editar Producto/Servicio'}
        </h2>
        
        {modo === 'listar' && (
          <button
            onClick={() => {
              setModo('crear');
              setForm({
                nombre: '',
                descripcion_corta: '',
                descripcion_larga: '',
                precio: '',
                unidad_medida: '',
                tipo_oferta: 'producto',
                estado: 'disponible',
                id_categoria: ''
              });
              setArchivoSeleccionado(null);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Agregar Nuevo
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {modo === 'listar' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {productos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes productos aún</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza agregando tu primer producto o servicio.</p>
              <div className="mt-6">
                <button
                  onClick={() => setModo('crear')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nuevo Producto
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {console.log('productos',productos)}{productos.map((prod) => (
                <li key={prod.id_producto_servicio}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {prod.imagen_url && (
                          <img 
                            className="h-16 w-16 rounded-md object-cover" 
                            src={`http://localhost:4000${prod.imagen_url}`} 
                            alt={prod.nombre} 
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-primary-600 truncate">
                            {prod.nombre}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {prod.descripcion_corta}
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            S/ {Number(prod.precio).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => iniciarEdicion(prod)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarProducto(prod.id_producto_servicio)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                        
                        <button
                        onClick={() => {
                          setProductoSeleccionado(prod.id_producto_servicio);
                          setMostrarDetalle(true);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Ver
                      </button>

                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="tipo_oferta" className="block text-sm font-medium text-gray-700">
                    Tipo *
                  </label>
                  <select
                    id="tipo_oferta"
                    name="tipo_oferta"
                    value={form.tipo_oferta}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="producto">Producto</option>
                    <option value="servicio">Servicio</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="descripcion_corta" className="block text-sm font-medium text-gray-700">
                    Descripción Corta *
                  </label>
                  <input
                    type="text"
                    name="descripcion_corta"
                    id="descripcion_corta"
                    value={form.descripcion_corta}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="descripcion_larga" className="block text-sm font-medium text-gray-700">
                    Descripción Larga
                  </label>
                  <textarea
                    id="descripcion_larga"
                    name="descripcion_larga"
                    rows={3}
                    value={form.descripcion_larga}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                    Precio *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">S/</span>
                    </div>
                    <input
                      type="text"
                      name="precio"
                      id="precio"
                      value={form.precio}
                      onChange={handleChange}
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>



                <div className="sm:col-span-6">
                  <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-700">
                    Categoría *
                  </label>
                  <select
                    id="id_categoria"
                    name="id_categoria"
                    value={form.id_categoria}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias
                      .filter(c => c.tipo === form.tipo_oferta || c.tipo === 'ambos')
                      .map(cat => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                          {cat.nombre}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                    Estado *
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="agotado">Agotado</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Imagen del {form.tipo_oferta === 'producto' ? 'Producto' : 'Servicio'}
                      {modo === 'crear' && form.tipo_oferta === 'producto' && ' *'}
                    </label>
                    <div className="mt-1 flex items-center">
                      <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        <span>Seleccionar Archivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setArchivoSeleccionado(e.target.files[0])}
                          className="sr-only"
                        />
                      </label>
                      {archivoSeleccionado && (
                        <span className="ml-4 text-sm text-gray-500">{archivoSeleccionado.name}</span>
                      )}
                    </div>
                    {archivoSeleccionado && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(archivoSeleccionado)}
                          alt="Vista previa"
                          className="h-32 w-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                    {modo === 'editar' && !archivoSeleccionado && form.imagen_url && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Imagen actual:</p>
                        <img
                          src={`http://localhost:4000${form.imagen_url}`}
                          alt="Actual"
                          className="h-32 w-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModo('listar')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={modo === 'crear' ? crearProducto : actualizarProducto}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {modo === 'crear' ? 'Guardar Producto' : 'Actualizar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


        {/* mostrar detalle */}
        {mostrarDetalle && (
          <Modal onClose={() => setMostrarDetalle(false)}>
            <DetalleProductoServicio
              id={productoSeleccionado}
              onClose={() => setMostrarDetalle(false)}
            />
          </Modal>
        )}
    </div>
    
  );
}// fin


// funciones externas
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <XMarkIcon className="h-10 w-10 text-gray-700" />
        </button>
        {children}
      </div>
    </div>
  );
}
