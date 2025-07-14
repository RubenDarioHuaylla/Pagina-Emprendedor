// lo ultimo de (2/07/2025) para que no olvide est este comentarios)
import SidebarEmprendedor from "../components/SidebarEmprendedor";
import HeaderPanel from "../components/HeaderPanelEmprendedor";
// Este será el layout principal del emprendedor
export default function PanelEmprendedor({children}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar de Navegación */}
      <SidebarEmprendedor />
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderPanel />
        
        {/* Contenido dinámico */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

