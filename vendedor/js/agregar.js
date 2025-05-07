document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const tipoSelect = document.getElementById("tipo");
    const categoriaSelect = document.getElementById("categoria");
    const formulario = document.getElementById("form-producto");
    const btnCancelar = document.getElementById("btn-cancelar");
    const formularioContainer = document.getElementById("formulario-agregar");

    // Datos de categorías
    const categorias = {
        Producto: ["Electrónica", "Ropa", "Hogar", "Alimentos", "Juguetes"],
        Servicio: ["Consultoría", "Reparaciones", "Diseño", "Transporte", "Educación"]
    };

    // Función para actualizar categorías
    function actualizarCategorias() {
        const tipoSeleccionado = tipoSelect.value;
        categoriaSelect.innerHTML = '<option value="">Seleccione una categoría</option>';

        if (tipoSeleccionado && categorias[tipoSeleccionado]) {
            categorias[tipoSeleccionado].forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria;
                option.textContent = categoria;
                categoriaSelect.appendChild(option);
            });
        }
    }

    // Event listeners
    tipoSelect.addEventListener("change", actualizarCategorias);

    // Inicializar categorías si hay un tipo seleccionado
    if (tipoSelect.value) {
        actualizarCategorias();
    }

    // Manejar envío del formulario
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        // Obtener valores del formulario
        const nombre = document.getElementById("nombre").value;
        const tipo = tipoSelect.value;
        const categoria = categoriaSelect.value;
        const descripcion = document.getElementById("descripcion").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const imagenInput = document.getElementById("imagen");
        const imagen = imagenInput.files[0];

        // Validación básica
        if (!imagen) {
            alert('Por favor selecciona una imagen');
            return;
        }

        // Leer la imagen como Base64
        const reader = new FileReader();
        reader.onload = function(e) {
            const productos = JSON.parse(localStorage.getItem("productos")) || [];
            
            const nuevoProducto = {
                id: Date.now(),
                nombre,
                tipo,
                categoria,
                descripcion,
                precio,
                imagen: e.target.result,
                disponible: true,
                fechaCreacion: new Date().toISOString()
            };

            productos.push(nuevoProducto);
            localStorage.setItem("productos", JSON.stringify(productos));

            // Cerrar formulario y redirigir
            formularioContainer.style.display = "none";
            window.location.href = "productos.html";
        };
        reader.readAsDataURL(imagen);
    });

    // Manejar cancelar
    btnCancelar.addEventListener("click", (e) => {
        e.preventDefault();
        formulario.reset();
        formularioContainer.style.display = "none";
        window.location.href = "productos.html";
    });
});