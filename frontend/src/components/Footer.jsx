export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Logo y descripción */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">EmprendeLocal</h2>
            <p className="text-gray-300 mb-4">
              Conectando emprendedores con su comunidad desde 2023.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Explorar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cómo funciona</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Testimonios</a></li>
            </ul>
          </div>

          {/* Columna 3: Para emprendedores */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Para Emprendedores</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Registrar negocio</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Preguntas frecuentes</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2 text-gray-300"></i>
                <span className="text-gray-300">Av. Emprendedores 123, Cusco</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-2 text-gray-300"></i>
                <span className="text-gray-300">+51 987 654 321</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-2 text-gray-300"></i>
                <span className="text-gray-300">hola@emprendelocal.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2023 EmprendeLocal. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Términos de servicio</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}