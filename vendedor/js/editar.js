document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const tipoSelect = document.getElementById("tipo");
    const categoriaSelect = document.getElementById("categoria");

    const categorias = {
        Producto: ["Electrónica", "Ropa", "Hogar", "Alimentos", "Juguetes", "Bebidas", "Macotas"],
        Servicio: ["Consultoría", "Reparaciones", "Diseño", "Transporte", "Educación"]
    };

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        alert("Producto no encontrado");
        window.location.href = "index.html";
        return;
    }

    // Rellenar campos
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;

    // Cargar tipos (Producto / Servicio)
    ["Producto", "Servicio"].forEach(t => {
        const option = document.createElement("option");
        option.value = t;
        option.textContent = t;
        tipoSelect.appendChild(option);
    });

    tipoSelect.value = producto.tipo;

    // Función para actualizar las categorías según el tipo seleccionado
    function actualizarCategorias(tipo) {
        categoriaSelect.innerHTML = "";
        if (!categorias[tipo]) return;

        categorias[tipo].forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categoriaSelect.appendChild(option);
        });
    }

    // Actualiza categorías cuando cambia el tipo
    tipoSelect.addEventListener("change", () => {
        actualizarCategorias(tipoSelect.value);
    });

    // Mostrar categorías del tipo inicial
    actualizarCategorias(producto.tipo);
    categoriaSelect.value = producto.categoria;

    // Mostrar imagen previa si hay
    if (producto.imagen) {
        document.getElementById("preview-imagen").src = producto.imagen;
    }

    // Guardar cambios
    document.getElementById("form-editar").addEventListener("submit", (e) => {
        e.preventDefault();

        producto.nombre = document.getElementById("nombre").value;
        producto.descripcion = document.getElementById("descripcion").value;
        producto.precio = parseFloat(document.getElementById("precio").value);
        producto.tipo = tipoSelect.value;
        producto.categoria = categoriaSelect.value;

        const imagenInput = document.getElementById("imagen");
        if (imagenInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                producto.imagen = e.target.result;
                localStorage.setItem("productos", JSON.stringify(productos));
                window.location.href = "productos.html";
            };
            reader.readAsDataURL(imagenInput.files[0]);
        } else {
            localStorage.setItem("productos", JSON.stringify(productos));
            window.location.href = "productos.html";
        }
    });

    // Botón cancelar
    document.getElementById("btn-cancelar").addEventListener("click", () => {
        window.location.href = "productos.html";
    });
});
