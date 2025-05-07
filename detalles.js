document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("Detalles");

    // Obtener ID del producto desde la URL
    const id = parseInt(new URLSearchParams(window.location.search).get("id"));
    if (isNaN(id)) {
        mostrarError("ID no válido.");
        return;
    }

    // Obtener productos desde localStorage
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        mostrarError("Producto no encontrado.");
        return;
    }

    renderizarDetalle(producto);

    // Función para mostrar mensaje de error
    function mostrarError(mensaje) {
        contenedor.innerHTML = `<p class="error">${mensaje}</p>`;
    }

    // Función para renderizar los detalles del producto
    function renderizarDetalle(producto) {
        contenedor.innerHTML = ""; // Limpiar contenedor

        const card = document.createElement("div");
        card.classList.add("producto-detalle-container");

        // Header estilo red social
        card.innerHTML += `
            <div class="producto-header">
                <img src="img/perfil.jpg" alt="Vendedor" class="profile-pic">
                <div class="header-info">
                    <h4>Vendedor</h4>
                    <span class="fecha">Publicado el ${formatearFecha(new Date())}</span>
                </div>
            </div>
        `;

        // Imagen principal
        card.innerHTML += `
            <div class="producto-imagen-container">
                <img src="${producto.imagen || 'img/placeholder.png'}" 
                     alt="Imagen de ${producto.nombre}" 
                     class="producto-imagen-principal">
            </div>
        `;

        // Información del producto
        card.innerHTML += `
            <div class="producto-info-container">
                <h1>${producto.nombre}</h1>
                <h2 class="producto-precio">S/ ${producto.precio.toFixed(2)}</h2>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-meta">
                    <p><strong>Tipo:</strong> ${producto.tipo}</p>
                    <p><strong>Categoría:</strong> ${producto.categoria}</p>
                    <p><strong>Disponibilidad:</strong> ${producto.disponible ? 'En stock' : 'Agotado'}</p>
                </div>
            </div>
        `;

        // Botón de volver
        const backButton = document.createElement("button");
        backButton.classList.add("back-button");
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Volver';
        backButton.onclick = () => window.location.href = "productos.html";
        card.appendChild(backButton);

        contenedor.appendChild(card);
    }

    // Función para formatear fecha en formato local (dd/mm/yyyy)
    function formatearFecha(fecha) {
        return fecha.toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }
});
