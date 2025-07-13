import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BusinessCard from '../components/BusinessCard';
import SearchBar from '../components/SearchBar';
import API from '../api/axios';

export default function Home() {
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar emprendimientos destacados
        const responseEmp = await API.get('/api/emprendimientos/destacados');
        setFeaturedBusinesses(responseEmp.data.data || []);
        
        // Cargar categorías
        const responseCat = await API.get('/api/rubros');
        setCategories(responseCat.data || []);
        
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">Cargando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Descubre emprendimientos en Cusco
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Apoya el comercio local y encuentra productos y servicios únicos
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/registro?rol=cliente" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Registrarse como Cliente
            </Link>
            <Link 
              to="/registro?rol=emprendedor" 
              className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Soy Emprendedor
            </Link>
          </div>
        </section>

        {/* Sección de Categorías */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Puedes encontrar Categoria como: </h2>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((rubro) => (
                <Link 
                  to={`/emprendimientos?rubro=${encodeURIComponent(rubro.nombre)}`}
                  key={rubro.id_rubro}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
                >
                  <span className="text-2xl mb-2">🏷️</span>
                  <h3 className="font-medium text-gray-800">{rubro.nombre}</h3>
                  {rubro.descripcion && (
                    <p className="text-sm text-gray-500 mt-1 text-center">
                      {rubro.descripcion.substring(0, 30)}...
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No se encontraron categorías</p>
            </div>
          )}
        </section>

        {/* Emprendimientos Destacados */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Emprendimientos destacados</h2>
            <Link to="/emprendimientos" className="text-primary-600 hover:underline">
              Ver todos →
            </Link>
          </div>
          
          {featuredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map(business => (
                <BusinessCard 
                  key={business.id_emprendimiento}
                  id={business.id_emprendimiento}
                  name={business.nombre_negocio} 
                  category={business.rubro} 
                  rating={business.promedio_valoracion}
                  description={business.descripcion_corta || business.descripcion}
                  logo={business.logo_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No hay emprendimientos destacados aún</p>
            </div>
          )}
        </section>

        {/* Sección de cómo funciona */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Busca emprendimientos</h3>
              <p className="text-gray-600">Encuentra negocios locales por categoría o ubicación</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Contacta directamente</h3>
              <p className="text-gray-600">Habla con el emprendedor por WhatsApp o redes sociales</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-medium text-lg mb-2">Deja tu reseña</h3>
              <p className="text-gray-600">Comparte tu experiencia para ayudar a otros</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}