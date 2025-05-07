// listado.js
function iniciarListadoProductos() {
    const categoriaSelect = document.getElementById('categoria-select');
    const precioRange = document.getElementById('precio-range');
    const precioValor = document.getElementById('precio-valor');
    const categoriaActual = document.getElementById('categoria-actual');
    const gridProductos = document.getElementById('grid-productos');
    const sinProductos = document.getElementById('sin-productos');
  
    const params = new URLSearchParams(window.location.search);
    const categoriaURL = params.get('categoria');
  
    if (categoriaURL) {
      categoriaSelect.value = categoriaURL;
      categoriaActual.textContent = categoriaURL;
    }
  
    function filtrarProductos() {
      const categoriaSeleccionada = categoriaSelect.value;
      const precioMaximo = parseInt(precioRange.value);
      precioValor.textContent = `S/ ${precioMaximo}`;
      categoriaActual.textContent = categoriaSeleccionada;
  
      const productosFiltrados = productos.filter(p =>
        (categoriaSeleccionada === 'Todos' || p.categoria === categoriaSeleccionada) &&
        p.precio <= precioMaximo
      );
  
      mostrarProductos(productosFiltrados);
  
      const url = new URL(window.location);
      url.searchParams.set('categoria', categoriaSeleccionada);
      window.history.pushState({}, '', url);
    }
  
    function mostrarProductos(productosArray) {
      gridProductos.innerHTML = '';
  
      if (productosArray.length === 0) {
        gridProductos.style.display = 'none';
        sinProductos.style.display = 'block';
        return;
      }
  
      gridProductos.style.display = 'grid';
      sinProductos.style.display = 'none';
  
      productosArray.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';
        tarjeta.innerHTML = `
          <div class="contenedor-imagen">
            <img src="${producto.imagen}" alt="${producto.nombre}" />
          </div>
          <div class="detalles-producto">
            <h3>${producto.nombre}</h3>
            <p class="precio-producto">S/ ${producto.precio}</p>
            <button onclick="verDetalleProducto(${producto.id})">Ver más</button>
          </div>
        `;
        gridProductos.appendChild(tarjeta);
      });
    }
  
    if (categoriaSelect) categoriaSelect.addEventListener('change', filtrarProductos);
    if (precioRange) precioRange.addEventListener('input', filtrarProductos);
  
    filtrarProductos();
  }
  
  function verDetalleProducto(id) {
    window.location.href = `DetalleProducto.html?id=${id}`;
  }
  
  document.addEventListener('DOMContentLoaded', iniciarListadoProductos);
  