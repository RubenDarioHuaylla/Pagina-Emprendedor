document.addEventListener("DOMContentLoaded", () => {
    // Recuperar productos de localStorage
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    const contenedor = document.getElementById("lista-productos");

    // Función principal para renderizar productos
    function renderizarProductos() {
        contenedor.innerHTML = "";

        if (productos.length === 0) {
            contenedor.innerHTML = "<p class='no-productos'>No hay productos disponibles.</p>";
            return;
        }

        productos.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("producto-card");
            card.dataset.id = producto.id;

            // Imagen del producto
            const img = document.createElement("img");
            img.src = producto.imagen;
            img.alt = `Imagen de ${producto.nombre}`;
            img.classList.add("producto-img");
            card.appendChild(img);

            // Información básica
            const infoBasica = document.createElement("div");
            infoBasica.classList.add("producto-info");
            
            const h3 = document.createElement("h3");
            h3.textContent = producto.nombre;
            infoBasica.appendChild(h3);

            const precio = document.createElement("p");
            precio.textContent = `S/ ${producto.precio.toFixed(2)}`;
            precio.classList.add("producto-precio");
            infoBasica.appendChild(precio);

            // Checkbox de disponibilidad - CORRECCIÓN IMPORTANTE
            const disponibilidadContainer = document.createElement("div");
            disponibilidadContainer.classList.add("disponibilidad-container");
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox"; // Corrección: "checkbox" (antes tenía un error tipográfico)
            checkbox.id = `disponible-${producto.id}`;
            checkbox.checked = producto.disponible || true; // Asigna el estado guardado
            checkbox.addEventListener("change", () => {
                // Actualiza el estado en el array de productos
                const productoActualizado = productos.find(p => p.id === producto.id);
                if (productoActualizado) {
                    productoActualizado.disponible = checkbox.checked;
                    localStorage.setItem("productos", JSON.stringify(productos));
                }
            });
            
            const label = document.createElement("label");
            label.htmlFor = `disponible-${producto.id}`;
            label.textContent = " Disponible";
            
            disponibilidadContainer.appendChild(checkbox);
            disponibilidadContainer.appendChild(label);
            infoBasica.appendChild(disponibilidadContainer);

            card.appendChild(infoBasica);

            // Botones de acciones
            const botones = document.createElement("div");
            botones.classList.add("producto-botones");

            // Botón Mostrar Detalles
            const btnMostrar = document.createElement("button");
            btnMostrar.textContent = "Mostrar detalles";
            btnMostrar.classList.add("btn-mostrar");
            btnMostrar.onclick = () => mostrarDetalles(producto.id);
            botones.appendChild(btnMostrar);

            // Botón Editar
            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn-editar");
            btnEditar.onclick = () => editarProducto(producto.id);
            botones.appendChild(btnEditar);

            // Botón Eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("btn-eliminar");
            btnEliminar.onclick = () => eliminarProducto(producto.id);
            botones.appendChild(btnEliminar);

            card.appendChild(botones);
            contenedor.appendChild(card);
        });
    }

    // Función para editar producto
    function editarProducto(id) {
        window.location.href = `editar.html?id=${id}`;
    }

    // Función para mostrar detalles
    function mostrarDetalles(id) {
        window.location.href = `detalles.html?id=${id}`;
    }

    // Función para eliminar producto
    function eliminarProducto(id) {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            productos = productos.filter(p => p.id !== id);
            localStorage.setItem("productos", JSON.stringify(productos));
            renderizarProductos();
        }
    }

    // Inicializar
    renderizarProductos();
});