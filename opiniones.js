document.addEventListener('DOMContentLoaded', () => {
    // Datos de prueba simulados
    const productos = [
        {
            id: "prod-1",
            nombre: "Producto Ejemplo 1",
            imagen: "img/img1.jpg",
            usuarioId: "emprendedor-1",
            reseñas: [
                {
                    cliente: "Cliente Satisfecho",
                    valoracion: 5,
                    comentario: "Excelente producto, lo recomiendo!",
                    fecha: "2023-05-15"
                },
                {
                    cliente: "Cliente Regular",
                    valoracion: 3,
                    comentario: "Buen producto pero podría mejorar",
                    fecha: "2023-05-10"
                }
            ]
        },
        {
            id: "prod-2",
            nombre: "Producto Ejemplo 2",
            imagen: "img/img2.jpg",
            usuarioId: "emprendedor-1",
            reseñas: [
                {
                    cliente: "Cliente Feliz",
                    valoracion: 4,
                    comentario: "Muy buena calidad",
                    fecha: "2023-05-12"
                }
            ]
        },
        {
            id: "prod-3",
            nombre: "Producto de otro emprendedor",
            imagen: "img/img3.jpg",
            usuarioId: "emprendedor-1",
            reseñas: [
                {
                    cliente: "Otro Cliente",
                    valoracion: 2,
                    comentario: "No cumplió mis expectativas",
                    fecha: "2023-04-20"
                }
            ]
        }
    ];

    // Emprendedor actual
    const usuarioId = "emprendedor-1";

    // Filtrar productos del emprendedor
    const misProductos = productos.filter(p => p.usuarioId === usuarioId);

    // Mostrar productos y reseñas
    mostrarProductos(misProductos);

    // Mostrar promedio general del emprendedor
    const promedioGeneral = calcularPromedioGeneral(misProductos);
    document.getElementById('promedio-general').textContent = `Promedio general: ${promedioGeneral} ★`;

    const totalReseñas = contarTotalReseñas(misProductos);
    document.getElementById('total-reseñas').textContent = `Total de reseñas: ${totalReseñas}`;

    
});

// Mostrar productos con sus reseñas
function mostrarProductos(productos) {
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('producto-card');

        card.innerHTML = `
            <div class="producto-info">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
                <div>
                    <h3>${producto.nombre}</h3>
                    <p>${producto.reseñas.length} reseña(s)</p>
                    <p>Promedio: ${calcularPromedio(producto.reseñas)} ★</p>
                </div>
            </div>
            <div class="lista-reseñas-producto">
                ${producto.reseñas.map(reseña => `
                    <div class="reseña">
                        <div class="reseña-header">
                            <strong>${reseña.cliente}</strong>
                            <span class="rating">${'★'.repeat(reseña.valoracion)}${'☆'.repeat(5 - reseña.valoracion)}</span>
                            <small>${reseña.fecha}</small>
                        </div>
                        <p>${reseña.comentario}</p>
                    </div>
                `).join('')}
            </div>
        `;

        contenedor.appendChild(card);
    });
}

// Calcular promedio de reseñas
function calcularPromedio(reseñas) {
    if (reseñas.length === 0) return "0.0";
    const suma = reseñas.reduce((acc, r) => acc + r.valoracion, 0);
    return (suma / reseñas.length).toFixed(1);
}
function calcularPromedioGeneral(productos) {
    let totalValoraciones = 0;
    let totalReseñas = 0;

    productos.forEach(producto => {
        producto.reseñas.forEach(reseña => {
            totalValoraciones += reseña.valoracion;
            totalReseñas++;
        });
    });

    if (totalReseñas === 0) return "0.0";
    return (totalValoraciones / totalReseñas).toFixed(1);
}


function contarTotalReseñas(productos) {
    return productos.reduce((total, producto) => total + producto.reseñas.length, 0);
}
