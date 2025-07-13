import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function MiEmprendimiento() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rubros, setRubros] = useState([]);
  const [modo, setModo] = useState('cargando');
  const [datos, setDatos] = useState(null);
  const [form, setForm] = useState({
    nombre_negocio: '',
    descripcion: '',
    telefono_contacto: '',
    facebook_url: '',
    instagram_url: '',
    whatsapp_url: '',
    logo_url: '',
    direccion: '',
    email_contacto: '',
    id_rubro: ''
  });
  const [error, setError] = useState('');

  // Cargar datos existentes
  useEffect(() => {
    if (!usuario?.token) {
      navigate('/loginForm');
      return;
    }

    const cargarEmprendimiento = async () => {
      try {
        const res = await API.get('/api/emprendimientos/mio', {
          headers: { Authorization: `Bearer ${usuario.token}` },
        });

        const resRubros = await API.get('/api/rubros', {
          headers: { Authorization:  `Bearer ${usuario.token}`},
        });

        if (res.data) {
          setDatos(res.data);
          setModo('ver');
        } else {
          setModo('crear');
        }
        setRubros(resRubros.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setModo('crear');
        } else {
          console.error('Error:', err);
          setError('Error al cargar los datos');
        }
      }
    };

    cargarEmprendimiento();
  }, [usuario?.token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.nombre_negocio.trim()) {
      setError('El nombre del negocio es requerido');
      return false;
    }
    if (!form.descripcion.trim()) {
      setError('La descripción es requerida');
      return false;
    }
    if (form.telefono_contacto && !/^\d{9}$/.test(form.telefono_contacto)) {
      setError('El teléfono debe tener 9 dígitos');
      return false;
    }

    if (!form.id_rubro) {
      setError('Debes seleccionar una rubro para tu negocio');
      return false;
    }
    return true;

  };

  const crearEmprendimiento = async () => {
    if (!validarFormulario()) return;

    try {
      const res = await API.post('/api/emprendimientos', form, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
      setDatos(res.data);
      setModo('ver');
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error al crear emprendimiento');
    }
  };

  const editarEmprendimiento = async () => {
    if (!validarFormulario()) return;

    try {
      const res = await API.put('/api/emprendimientos/mio', form, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });
      setDatos(res.data.data);
      setModo('ver');
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Error al actualizar');
    }
  };

  const subirLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Por favor sube una imagen válida');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await API.post('/api/emprendimientos/subir-logo', formData, {
        headers: {
          Authorization: `Bearer ${usuario.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setForm(prev => ({ ...prev, logo_url: res.data.logo_url }));
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al subir imagen');
    }
  };

  useEffect(() => {
    if (modo === 'editar' && datos) {
      setForm({
        nombre_negocio: datos.nombre_negocio || '',
        descripcion: datos.descripcion || '',
        telefono_contacto: datos.telefono_contacto || '',
        facebook_url: datos.facebook_url || '',
        instagram_url: datos.instagram_url || '',
        whatsapp_url: datos.whatsapp_url || '',
        logo_url: datos.logo_url || '',
        direccion: datos.direccion || '',
        email_contacto: datos.email_contacto || '',
        id_rubro: datos.id_rubro || ''
      });
    }
  }, [modo, datos]);

  if (modo === 'cargando') {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Encabezado */}
          <div className="bg-primary-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              {modo === 'crear' ? 'Registrar Mi Emprendimiento' : 'Mi Emprendimiento'}
            </h2>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{error}</p>
              </div>
            )}

            {/* Modo Crear */}
            {modo === 'crear' && (
              <div className="space-y-6">
                <EmprendimientoForm 
                  form={form} 
                  onChange={handleChange} 
                  onFileChange={subirLogo}
                  rubros={rubros}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => logout()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={crearEmprendimiento}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Guardar Emprendimiento
                  </button>
                </div>
              </div>
            )}

            {/* Modo Ver */}
            {modo === 'ver' && datos && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {datos.logo_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={datos.logo_url}
                        alt="Logo del emprendimiento"
                        className="w-full max-h-96 object-contain rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">{datos.nombre_negocio}</h3>
                    <p className="mt-2 text-gray-600">{datos.descripcion}</p>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Información de Contacto</h4>
                        <ul className="mt-2 space-y-2 text-gray-600">
                          {datos.telefono_contacto && (
                            <li className="flex items-center">
                              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {datos.telefono_contacto}
                            </li>
                          )}
                          {datos.direccion && (
                            <li className="flex items-center">
                              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {datos.direccion}
                            </li>
                          )}
                          {datos.email_contacto && (
                          <li className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m0 0l-4-4m4 4l-4 4" />
                            </svg>
                            {datos.email_contacto}
                          </li>
                        )}

                        </ul>
                      </div>
                      {/*seccion de reddes sociales*/}
                      <div>
                      <h4 className="font-medium text-gray-900 mb-2">Redes Sociales</h4>
                      <div className="space-y-2">
                        {datos.facebook_url && (
                          <div className="flex items-center space-x-2">
                            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" 
                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657
                                 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 
                                 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 
                                 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                              </svg>
                            <a href={datos.facebook_url} className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                              {datos.facebook_url}
                            </a>
                          </div>
                        )}
                        {datos.instagram_url && (
                          <div className="flex items-center space-x-2">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">

                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            
                            </svg>
                            <a href={datos.instagram_url} className="text-pink-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                              {datos.instagram_url}
                            </a>
                          </div>
                        )}
                        {datos.whatsapp_url && (
                          <div className="flex items-center space-x-2">
                            <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">

                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />

                            </svg>
                            <a href={datos.whatsapp_url} className="text-green-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                              {datos.whatsapp_url}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                      { /**/  }
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setModo('editar')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Editar Emprendimiento
                  </button>
                </div>
              </div>
            )}

            {/* Modo Editar */}
            {modo === 'editar' && (
              <div className="space-y-6">
                <EmprendimientoForm 
                  form={form} 
                  onChange={handleChange} 
                  onFileChange={subirLogo}
                  rubros = {rubros}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setModo('ver')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={editarEmprendimiento}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente de formulario reutilizable
function EmprendimientoForm({ form, onChange, onFileChange, rubros }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre_negocio" className="block text-sm font-medium text-gray-700">
            Nombre del Negocio *
          </label>
          <input
            id="nombre_negocio"
            name="nombre_negocio"
            type="text"
            value={form.nombre_negocio}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="telefono_contacto" className="block text-sm font-medium text-gray-700">
            Teléfono de Contacto
          </label>
          <input
            id="telefono_contacto"
            name="telefono_contacto"
            type="tel"
            value={form.telefono_contacto}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: 987654321"
          />
        </div>

        <div>
          <label htmlFor="email_contacto" className="block text-sm font-medium text-gray-700">
            Email de Contacto
          </label>
          <input
            id="email_contacto"
            name="email_contacto"
            type="email"
            value={form.email_contacto}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="4"
          value={form.descripcion}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        ></textarea>
      </div>

      <div>
  <label htmlFor="id_rubro" className="block text-sm font-medium text-gray-700">
    Rubro *
  </label>
  <select
    id="id_rubro"
    name="id_rubro"
    value={form.id_rubro}
    onChange={onChange}
    required
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
  >
    <option value="">Seleccione un rubro</option>
    {rubros.map((rubro) => (
      <option key={rubro.id_rubro} value={rubro.id_rubro}>
        {rubro.nombre}
      </option>
    ))}
  </select>
</div>


      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <input
          id="direccion"
          name="direccion"
          type="text"
          value={form.direccion}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700">
            Facebook URL
          </label>
          <input
            id="facebook_url"
            name="facebook_url"
            type="url"
            value={form.facebook_url}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://facebook.com/tuemprendimiento"
          />
        </div>

        <div>
          <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700">
            Instagram URL
          </label>
          <input
            id="instagram_url"
            name="instagram_url"
            type="url"
            value={form.instagram_url}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://instagram.com/tuemprendimiento"
          />
        </div>

        <div>
          <label htmlFor="whatsapp_url" className="block text-sm font-medium text-gray-700">
            WhatsApp URL
          </label>
          <input
            id="whatsapp_url"
            name="whatsapp_url"
            type="url"
            value={form.whatsapp_url}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://wa.me/51987654321"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Logo del Emprendimiento
        </label>
        <div className="mt-1 flex items-center">
          <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <span>Subir Imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="sr-only"
            />
          </label>
          {form.logo_url && (
            <span className="ml-4 text-sm text-gray-500">Imagen seleccionada</span>
          )}
        </div>
        {form.logo_url && (
          <div className="mt-2">
            <img
              src={form.logo_url}
              alt="Vista previa del logo"
              className="h-32 w-32 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}