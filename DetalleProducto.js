// Función para inicializar la página de detalles del producto
function iniciarDetalleProducto() {
    const params = new URLSearchParams(window.location.search);
    const productoId = parseInt(params.get('id'));
   
    if (!productoId) {
        window.location.href = 'ListadoProducto.html';
        return;
    }
   
    const producto = productos.find(p => p.id === productoId);
   
    if (!producto) {
        window.location.href = 'ListadoProducto.html';
        return;
    }
   
    // Elementos DOM para detalles
    const detalleContainer = document.getElementById('detalle-container');
   
    // Llenar la información del producto
    detalleContainer.innerHTML = `
        <div class="detalle-producto-grid">
            <div class="imagen-grande">
                <img src="${producto.imagen}" alt="${producto.nombre}" />
            </div>
            <div class="detalle-info">
                <h1>${producto.nombre}</h1>
                <p class="precio-detalle">S/ ${producto.precio}</p>
                <span class="categorias-tag">${producto.categoria}</span>
                <p class="descripcion-producto">${producto.descripcion}</p>
               
                <div class="valoracion">
                    <div class="estrellas">${mostrarEstrellas(producto.valoracion)}</div>
                    <span class="valor-numero">${producto.valoracion.toFixed(1)}</span>
                </div>
               
                <button class="boton-valorar" onclick="abrirModalValoracion(${producto.id})">
                    Valorar este producto
                </button>
               
                <div class="emprendedor-seccion">
                    <h3>Acerca del emprendedor</h3>
                    <div class="emprendedor-card" onclick="verPerfilEmprendedor(${producto.emprendedor.id})">
                        <div class="avatar">
                            <img src="${producto.emprendedor.avatar}" alt="${producto.emprendedor.nombre}" />
                        </div>
                        <div class="emprendedor-info">
                            <h4>${producto.emprendedor.nombre}</h4>
                            <p>${producto.emprendedor.descripcion}</p>
                        </div>
                    </div>
                </div>
               
                <div class="comentarios-seccion">
                    <h3>Comentarios (${producto.comentarios.length})</h3>
                    ${mostrarComentarios(producto.comentarios)}
                </div>
            </div>
        </div>
        
        <!-- Modal de valoración (oculto por defecto) -->
        <div id="modal-valoracion" class="modal-overlay">
            <div class="modal-contenido">
                <div class="modal-encabezado">
                    <h3>Valorar: ${producto.nombre}</h3>
                    <span class="cerrar-modal" onclick="cerrarModalValoracion()">&times;</span>
                </div>
                <div class="modal-cuerpo">
                    <div class="seccion-valoracion">
                        <p>¿Cómo calificarías este producto?</p>
                        <div class="estrellas-seleccion" id="estrellas-seleccion">
                            <span class="estrella" data-valor="1">☆</span>
                            <span class="estrella" data-valor="2">☆</span>
                            <span class="estrella" data-valor="3">☆</span>
                            <span class="estrella" data-valor="4">☆</span>
                            <span class="estrella" data-valor="5">☆</span>
                        </div>
                        <div class="valor-seleccionado">Tu valoración: <span id="valor-estrella">0</span>/5</div>
                    </div>
                    <div class="seccion-comentario">
                        <label for="comentario-texto">Tu comentario:</label>
                        <textarea id="comentario-texto" placeholder="¿Qué te pareció este producto?"></textarea>
                        
                        <label for="nombre-usuario">Tu nombre:</label>
                        <input type="text" id="nombre-usuario" placeholder="Escribe tu nombre">
                    </div>
                </div>
                <div class="modal-pie">
                    <button class="btn-cancelar" onclick="cerrarModalValoracion()">Cancelar</button>
                    <button class="btn-enviar" onclick="enviarValoracion(${producto.id})">Enviar valoración</button>
                </div>
            </div>
        </div>
    `;

    // Configurar la funcionalidad de selección de estrellas
    configurarEstrellas();
}

// Función para mostrar las estrellas de valoración
function mostrarEstrellas(valoracion) {
    const estrellaLlena = '★';
    const estrellaVacia = '☆';
    const estrellas = Math.round(valoracion);
   
    return estrellaLlena.repeat(estrellas) + estrellaVacia.repeat(5 - estrellas);
}

// Función para mostrar comentarios
function mostrarComentarios(comentarios) {
    if (comentarios.length === 0) {
        return '<p>No hay comentarios para este producto.</p>';
    }
   
    return comentarios.map(c => `
        <div class="comentario">
            <div class="comentario-cabecera">
                <span class="comentario-usuario">${c.usuario}</span>
                <span class="comentario-fecha">${c.fecha}</span>
            </div>
            <p class="comentario-texto">${c.texto}</p>
            ${c.valoracion ? `<div class="comentario-valoracion">${mostrarEstrellas(c.valoracion)}</div>` : ''}
        </div>
    `).join('');
}

// Función para navegar al perfil del emprendedor
function verPerfilEmprendedor(id) {
    alert(`Navegando al perfil del emprendedor con ID: ${id}`);
    // Aquí implementarías la navegación real
    // window.location.href = `perfil-emprendedor.html?id=${id}`;
}

// Nuevas funciones para la valoración del producto
function abrirModalValoracion(productoId) {
    const modal = document.getElementById('modal-valoracion');
    modal.style.display = 'flex';
    
    // Resetear valores
    document.querySelectorAll('#estrellas-seleccion .estrella').forEach(estrella => {
        estrella.textContent = '☆';
        estrella.classList.remove('seleccionada');
    });
    document.getElementById('valor-estrella').textContent = '0';
    document.getElementById('comentario-texto').value = '';
    document.getElementById('nombre-usuario').value = '';
}

function cerrarModalValoracion() {
    document.getElementById('modal-valoracion').style.display = 'none';
}

function configurarEstrellas() {
    const estrellas = document.querySelectorAll('#estrellas-seleccion .estrella');
    let valorSeleccionado = 0;
    
    estrellas.forEach(estrella => {
        // Evento al pasar el mouse por encima
        estrella.addEventListener('mouseover', function() {
            const valor = parseInt(this.getAttribute('data-valor'));
            
            // Actualizar todas las estrellas según el valor
            estrellas.forEach(e => {
                const valorEstrella = parseInt(e.getAttribute('data-valor'));
                e.textContent = valorEstrella <= valor ? '★' : '☆';
            });
        });
        
        // Evento al sacar el mouse
        estrella.addEventListener('mouseout', function() {
            // Restaurar la selección actual
            estrellas.forEach(e => {
                const valorEstrella = parseInt(e.getAttribute('data-valor'));
                e.textContent = valorEstrella <= valorSeleccionado ? '★' : '☆';
            });
        });
        
        // Evento al hacer clic
        estrella.addEventListener('click', function() {
            valorSeleccionado = parseInt(this.getAttribute('data-valor'));
            document.getElementById('valor-estrella').textContent = valorSeleccionado;
            
            // Marcar estrellas seleccionadas
            estrellas.forEach(e => {
                const valorEstrella = parseInt(e.getAttribute('data-valor'));
                e.textContent = valorEstrella <= valorSeleccionado ? '★' : '☆';
                
                if (valorEstrella <= valorSeleccionado) {
                    e.classList.add('seleccionada');
                } else {
                    e.classList.remove('seleccionada');
                }
            });
        });
    });
}

function enviarValoracion(productoId) {
    const valorEstrellas = parseInt(document.getElementById('valor-estrella').textContent);
    const comentarioTexto = document.getElementById('comentario-texto').value.trim();
    const nombreUsuario = document.getElementById('nombre-usuario').value.trim();
    
    // Validaciones
    if (valorEstrellas === 0) {
        alert('Por favor, selecciona al menos 1 estrella para valorar');
        return;
    }
    
    if (comentarioTexto === '') {
        alert('Por favor, escribe un comentario');
        return;
    }
    
    if (nombreUsuario === '') {
        alert('Por favor, ingresa tu nombre');
        return;
    }
    
    // En un caso real, aquí se enviaría la valoración al servidor
    // Para este ejemplo, actualizamos el objeto local
    
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    // Crear nuevo comentario
    const fechaActual = new Date().toISOString().split('T')[0];
    const nuevoComentario = {
        usuario: nombreUsuario,
        texto: comentarioTexto,
        fecha: fechaActual,
        valoracion: valorEstrellas
    };
    
    // Añadir el comentario al inicio del array
    producto.comentarios.unshift(nuevoComentario);
    
    // Actualizar la valoración promedio
    const totalValoraciones = producto.comentarios.reduce((total, comentario) => {
        return total + (comentario.valoracion || 0);
    }, 0);
    
    producto.valoracion = totalValoraciones / producto.comentarios.length;
    
    // Actualizar la UI
    cerrarModalValoracion();
    iniciarDetalleProducto(); // Recargar la página de detalles
    
    // Mostrar un mensaje de confirmación
    alert('¡Gracias por tu valoración!');
}

// Ejecutar inicialización basada en la página actual
document.addEventListener('DOMContentLoaded', function() {
    // Detectar qué página estamos viendo
    const urlActual = window.location.pathname;
   
    if (urlActual.includes('DetalleProducto.html')) {
        iniciarDetalleProducto();
    } else {
        iniciarListadoProductos();
    }
});
