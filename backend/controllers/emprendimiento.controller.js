const Emprendimiento = require('../models/emprendimiento.model');


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
      whatsapp_url
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
      whatsapp_url
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


exports.actualizarEmprendimiento = async (req, res) => {
  try {
    const id_emprendimiento = req.params.id;
    const id_usuario_token = req.usuario.id; // Obtenido desde el token JWT

    // Validar que el emprendimiento sea del usuario autenticado
    const existente = await Emprendimiento.buscarPorId(id_emprendimiento);

    if (!existente) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    if (existente.id_usuario !== id_usuario_token) {
      return res.status(403).json({ error: 'No tienes permisos para modificar este emprendimiento' });
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
      whatsapp_url: req.body.whatsapp_url
    };

    await Emprendimiento.actualizar(id_emprendimiento, camposActualizables);

    res.json({ message: 'Emprendimiento actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar emprendimiento:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.listarEmprendimientos = async (req, res) => {
  try {
    const emprendimientos = await Emprendimiento.listarPorUsuario(req.usuario.id);
    res.json(emprendimientos);
  } catch (error) {
    console.error('Error al listar emprendimientos:', error);
    res.status(500).json({ error: error.message });
  }
};