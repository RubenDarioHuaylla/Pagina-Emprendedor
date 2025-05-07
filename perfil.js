const datosEmprendedor = {
    nombre: "Juan Pérez",
    celular: "+51 987654321",
    correo: "juan@mail.com",
    foto: "img/perfil.jpg"
  };
  
  // Cargar datos al iniciar
  window.onload = function () {
    document.getElementById("nombre").textContent = datosEmprendedor.nombre;
    document.getElementById("celular").textContent = datosEmprendedor.celular;
    document.getElementById("correo").textContent = datosEmprendedor.correo;
    document.getElementById("avatar").src = datosEmprendedor.foto;
  
    cargarProductos();
  };
  
  // Editar campos simuladamente
  function editarCampo(campo) {
    const span = document.getElementById(campo);
    const nuevoValor = prompt(`Editar ${campo}`, span.textContent);
    if (nuevoValor) {
      span.textContent = nuevoValor;
      datosEmprendedor[campo] = nuevoValor;
    }
  }
  
  // Cambiar foto (solo visual)
  function cambiarFoto() {
    const nuevaURL = prompt("Ingresa la URL de tu nueva foto:");
    if (nuevaURL) {
      document.getElementById("avatar").src = nuevaURL;
      datosEmprendedor.foto = nuevaURL;
    }
  }
  
  // Cargar productos desde localStorage
  function cargarProductos() {
    const lista = document.getElementById("lista-productos");
    lista.innerHTML = "";
  
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
  
    if (productos.length === 0) {
      lista.innerHTML = "<p>No hay productos registrados aún.</p>";
      return;
    }
  
    productos.forEach(p => {
      const card = document.createElement("div");
      card.className = "producto-card";
      card.innerHTML = `
        <img src="${p.imagen}" class="producto-imagen" alt="${p.nombre}">
        <div class="producto-nombre">${p.nombre}</div>
        <div class="producto-precio">S/ ${p.precio}</div>
        <button class="ver-producto">Ver más</button>
      `;
      lista.appendChild(card);
    });
  }
  