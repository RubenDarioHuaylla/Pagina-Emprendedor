const productoServicioModel = require('../models/producto_servicio.model');
const Emprendimiento = require('../models/emprendimiento.model');


// Crear un nuevo producto/servicio
exports.crearProductoServicio = async (req, res) => {
  try {

    const id_usuario = req.usuario.id; // Obtenido desde el token JWT
    const emprendimiento = await Emprendimiento.buscarPorUsuario(id_usuario);
    const {id_categoria, nombre, descripcion_corta, descripcion_larga, precio, unidad_medida,estado} = req.body;

    if (!emprendimiento) {
    return res.status(400).json({ error: 'Emprendimiento no encontrado' });
    }

    const id_emprendimiento = emprendimiento.id_emprendimiento;
    const imagen_url = req.file ? `/uploads/productos/${req.file.filename}` : null;
    const id_producto_servicio = await productoServicioModel.crear({
      id_emprendimiento,
      id_categoria,
      nombre,
      descripcion_corta,
      descripcion_larga,
      precio,
      unidad_medida,
      imagen_url,
      estado

    });

    productoCreado = await productoServicioModel.buscarPorId(id_producto_servicio);

    res.status(201).json({
      message: 'Producto/Servicio creado exitosamente','data': productoCreado
    });

  } catch (error) {
    console.error('Error al crear producto/servicio:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Actualizar un producto/servicio
exports.actualizarProductoServicio = async (req, res) => {
  try {
    console.log('Archivo recibido:', req.body);
    const id = req.params.id;
    const producto = await productoServicioModel.buscarPorId(id);

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const emprendimiento = await Emprendimiento.buscarPorUsuario(req.usuario.id);
    if (!emprendimiento) return res.status(403).json({ error: 'No autorizado: Emprendimiento no encontrado' });

    if (producto.id_emprendimiento !== emprendimiento.id_emprendimiento) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const datosActualizados = req.body;
    delete datosActualizados.tipo_oferta;

    // Si hay imagen nueva
    if (req.file) {
      datosActualizados.imagen_url = `/uploads/productos/${req.file.filename}`;
    }

    await productoServicioModel.actualizar(id, datosActualizados);

    productoActualizado = await productoServicioModel.buscarPorId(id);

    res.json({ message: 'Producto/Servicio actualizado', 'data': productoActualizado });
  } catch (err) {
    console.error('Error al actualizar:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};



// Listar productos/servicios de un emprendimiento en panel del emprededor.
exports.listarMisProductosServicios = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const emprendimiento = await Emprendimiento.buscarPorUsuario(usuarioId);

    if (!emprendimiento) {
      return res.status(404).json({ error: 'No tienes emprendimiento registrado' });
    }

    const productos = await productoServicioModel.buscarPorEmprendimiento(emprendimiento.id_emprendimiento);
    res.json(productos);
  } catch (err) {
    console.error('Error al listar productos/servicios:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


exports.subirImagen = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const rutaImagen = `/uploads/productos/${archivo.filename}`;

    // Aquí puedes actualizar el producto o guardarlo
    // Supongamos que pasas el id_producto por body
    const { id_producto } = req.body;

    await productoServicioModel.agregarImagen(id_producto, rutaImagen, id_usuario);

    res.json({ message: 'Imagen subida y asociada', ruta: rutaImagen });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
};

// Obtener un producto/servicio por ID
exports.verProductoPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const info = await productoServicioModel.detalle(id);
    const reseñas = await productoServicioModel.reseñas(id);

    if (!info) return res.status(404).json({ error: 'No encontrado' });
    res.json({success: true, data: { info, reseñas }});
    console.log('info' , info);
    console.log('reseñas', reseñas)
  } catch (err) {
    console.error('Error al obtener producto por ID:', err);
    res.status(500).json({ success: false, error: 'Error al optener informacion' });
  }
};


// Eliminar un producto/servicio
exports.eliminarProductoServicio = async (req, res) => {
  const id = req.params.id;
  try {
    await productoServicioModel.eliminar(id);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({error: 'Error del servidor' });
  }
};


  // rutas publicas
exports.listarProductosServicios = async (req, res) => {
  try {

    const filtros = {
      q: req.query.q  || undefined,
      categoria: req.query.categoria || undefined,
      tipo: req.query.tipo || undefined,
      orden: req.query.orden || undefined,
      precio_min: Number(req.query.precio_min) || undefined,
      precio_max: Number(req.query.precio_max) || undefined

    };

    const data = await productoServicioModel.listar(filtros);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error al obtener productos' });
  }
};

exports.detalleProductoServicio = async (req, res) => {
  try {
    const id = req.params.id;
    const info = await productoServicioModel.detalle(id);
    const reseñas = await productoServicioModel.reseñas(id);
    res.json({ success: true, data: { info, reseñas } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error al obtener detalle' });
  }
};


