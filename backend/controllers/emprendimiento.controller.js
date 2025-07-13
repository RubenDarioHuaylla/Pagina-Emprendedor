const Emprendimiento = require('../models/emprendimiento.model');
const Producto = require('../models/producto_servicio.model');

// Crear un nuevo emprendimiento
// Solo los usuarios con rol 'emprendedor' pueden crear emprendimientos
exports.crearEmprendimiento = async (req, res) => {
  try {

    // Verificar que el usuario tenga el rol de emprendedor
    if (req.usuario.rol !== 'emprendedor') {
      return res.status(403).json({ error: 'Solo los emprendedores pueden crear negocios' });
    }

    const id_usuario = req.usuario.id;

    const {
      nombre_negocio,
      descripcion,
      logo_url,
      direccion,
      email_contacto,
      telefono_contacto,
      facebook_url,
      instagram_url,
      whatsapp_url,
      id_rubro
    } = req.body;

    if (!nombre_negocio) {
      return res.status(400).json({ error: 'El nombre del negocio es obligatorio' });
    }

    const id_emprendimiento = await Emprendimiento.crear({
      id_usuario,
      nombre_negocio,
      descripcion,
      logo_url,
      direccion,
      email_contacto,
      telefono_contacto,
      facebook_url,
      instagram_url,
      whatsapp_url,
      id_rubro
    });

    res.status(201).json({
      message: 'Emprendimiento creado exitosamente',
      id_emprendimiento
    });

  } catch (error) {
    console.error('Error al crear emprendimiento:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Para actualizar emprendimiento
exports.actualizarEmprendimiento = async (req, res) => {
  try {
    
    const id_usuario = req.usuario.id; // Obtenido desde el token JWT

    // Buscar emprendimiento por el ID del usuario autenticado
    const existente = await Emprendimiento.buscarPorUsuario(id_usuario);

    if (!existente) {
      return res.status(404).json({ error: 'Emprendimiento no registrado' });
    }

    // Solo los campos que se van a actualizar
    const camposActualizables = { 
      nombre_negocio: req.body.nombre_negocio,
      descripcion: req.body.descripcion,
      logo_url: req.body.logo_url,
      direccion: req.body.direccion,
      email_contacto: req.body.email_contacto,
      telefono_contacto: req.body.telefono_contacto,
      facebook_url: req.body.facebook_url,
      instagram_url: req.body.instagram_url,
      whatsapp_url: req.body.whatsapp_url,
      id_rubro: req.body.id_rubro
    };

    await Emprendimiento.actualizar(existente.id_emprendimiento, camposActualizables);

    const empredimiento = await Emprendimiento.buscarPorId(existente.id_emprendimiento)

    res.json({ message: 'Emprendimiento actualizado correctamente', 'data':  empredimiento});
  } catch (error) {
    console.error('Error al actualizar emprendimiento:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


exports.obtenerEmprendimiento = async (req, res) => {
  try {
    // Verificar que el usuario tenga el rol de emprendedor
    const emprendimiento = await Emprendimiento.buscarPorUsuario(req.usuario.id);
    
    if (!emprendimiento) {
      return res.status(200).json(null);
    }
    res.json(emprendimiento);
  } catch (error) {
    console.error('Error al listar emprendimientos:', error);
    res.status(500).json({ error: 'Error del servidor al listar emprendimientos' });
  }
};


exports.verificarEmprendimiento = async (req, res) =>{
    const id = req.usuario.id;
    
    const empredimiento = await Emprendimiento.buscarPorUsuario(id);
    
    let existe = true;
    if(!empredimiento){
      existe = false;
    }
    return res.json({hayEmpredimiento: existe});
};

  // rutas publicas

exports.listarEmprendimientos = async (req, res) => {
  try {
    
    const filtros = {
      nombre: req.query.nombre || undefined,
      rubro: req.query.rubro == 'todos' ? undefined : req.query.rubro,
      valoracion_min: req.query.valoracion_min || undefined,
      orden: req.query.orden || 'valoracion_desc'
    };

    const data = await Emprendimiento.listar(filtros);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error al obtener emprendimientos' });
  }
};

exports.detalleEmprendimiento = async (req, res) => {
  try {
    const id = req.params.id;
    const info = await Emprendimiento.detalle(id);
    const productos = await Emprendimiento.listarProductos(id);
    const reseñas = await Emprendimiento.reseñas(id);
    res.json({ success: true, data: { info, productos, reseñas } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error al obtener detalle' });
  }
};

// En tu controller (emprendimientoController.js)

// emprendimientoController.js
exports.destacados = async (req, res) => {
  try {
    const destacados = await Emprendimiento.destacados();
    res.json({ 
      success: true,
      data: destacados // Envía directamente el array de emprendimientos
    });
  } catch (err) {
    console.log('Error', err)
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener destacados' 
    });
  }
};







