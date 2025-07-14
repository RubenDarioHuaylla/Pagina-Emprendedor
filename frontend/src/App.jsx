import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { AuthContext } from './context/AuthContext';

// versiones muy antiguas---
import Registro from './pages/Registro';
import AdminPanel from './pages/AdminPanel';


// public
import ListaEmpredimientos from './pages/EmpredimientoList';
import DetallesEmpredimientos from './pages/EmprendimientoDetail';
import ListaProductos from './pages/ProductosList';
import DetallesProductos from './pages/ProductoDetail';

// versiones nuevas---
// 2/07/2025 com tailwind 
import PanelLayout from './pages/PanelEmprendedor';
import MisProductos from './pages/MisProductos';
import Home from './pages/Home';
import LoginForm from './pages/LoginForm';
import MiEmprendimiento from './pages/MiEmpredimiento';
import EstadisticasEmprendedor from './pages/EstadisticasEmprendedor';
import ComentariosEmprendedor from './pages/ComentariosEmprendedor';
import ResumenEmprendedor from './pages/ResumenEmprendedor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RutaSoloSiTieneEmprendimiento from './routes/RutasSoloSiTieneEmprendimiento';



function RutaPrivada({ children }) {
  const { usuario } = useContext(AuthContext);
  return usuario ? children : <Navigate to="/loginForm" />;
}

function RutaPrivadaPorRol({ rolEsperado, children }) {
  const { usuario } = useContext(AuthContext);
  if (!usuario) return <Navigate to="/loginForm" />;
  if (usuario.rol !== rolEsperado) return <Navigate to="/loginForm" />;
  return children;
}

// Componente para rutas anidadas del panel
function PanelEmprendedorRoutes() {
  return (
    <RutaPrivadaPorRol rolEsperado="emprendedor">
      <PanelLayout>
        <Outlet />
      </PanelLayout>
    </RutaPrivadaPorRol>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>


          <Route path="/" element={<Home />} />
          <Route path="/registro" element={<Registro />} />
          
          {/* vesion antigua del proyecto*/}
          {/* Rutas de administrador */}
          <Route path="/admin" element={<RutaPrivadaPorRol rolEsperado="admin"><AdminPanel /></RutaPrivadaPorRol>} />
          
          
          {/*-- el mejorado con el tailwindcss*/ }
          <Route path="/loginForm" element={<LoginForm />} />
          
          <Route path="/observar" element={<ListaEmpredimientos />} />
          <Route path="/emprendimientos/:id" element={<DetallesEmpredimientos />} />
          <Route path="/ofertas" element={<ListaProductos />} />
          <Route path="/productos/:id" element={<DetallesProductos />} />


          
          <Route path="/panel" element={<PanelEmprendedorRoutes />}>
            <Route index element={<ResumenEmprendedor />} />
            <Route path="emprendimiento" element={<MiEmprendimiento />} />

            <Route
              path="productos"
              element={
                <RutaSoloSiTieneEmprendimiento>
                  <MisProductos />
                </RutaSoloSiTieneEmprendimiento>
              }
            />

            <Route
              path="comentarios"
              element={
                <RutaSoloSiTieneEmprendimiento>
                  <ComentariosEmprendedor />
                </RutaSoloSiTieneEmprendimiento>
              }
            />

            <Route
              path="estadisticas"
              element={
                <RutaSoloSiTieneEmprendimiento>
                  <EstadisticasEmprendedor />
                </RutaSoloSiTieneEmprendimiento>
              }
            />
          </Route>

        </Routes>

        <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      </BrowserRouter>
    </AuthProvider>
  );
}