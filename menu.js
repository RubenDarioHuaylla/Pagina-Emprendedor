document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    const menuItems = [
      { href: "productos.html", icon: "fa-box", text: "Mi Catálogo" },
      { href: "agregar.html", icon: "fa-plus-circle", text: "Agregar Ítem" },
      { href: "perfil.html", icon: "fa-user", text: "Perfil" },
      { href: "opiniones.html", icon: "fa-star", text: "Opiniones" },
      { href: "login.html", icon: "fa-sign-out-alt", text: "Cerrar Sesión", class: "logout" }
    ];
  
    const menuHTML = `
      <nav class="sidebar-nav">
        <ul>
          ${menuItems.map(item => `
            <li>
              <a href="${item.href}" class="${item.class || ''} ${currentPage === item.href ? 'active' : ''}">
                <i class="fas ${item.icon}"></i>
                <span>${item.text}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </nav>
    `;
    
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.innerHTML = menuHTML;
      
      // Agregar el logo/header del sidebar si no existe
      if (!sidebar.querySelector('.sidebar-header')) {
        sidebar.insertAdjacentHTML('afterbegin', `
          <div class="sidebar-header">
            <img src="img/perfil.jpg" alt="Logo" class="sidebar-logo">
            <h3>InkaMarket</h3>
          </div>
        `);
      }
    }
  });