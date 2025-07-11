const Reseña = require('../models/reseña.model');

// Crear nueva reseña
exports.create = async (req, res) => {
  console.log('datos', req.body)

  try {
    
    console.log('datos', req.body)
    // Validar rol de cliente
    if (req.usuario.rol !== 'cliente') {
      return res.status(403).json({ error: 'Solo los clientes pueden dejar reseñas' });
      
    }

    const { id_producto_servicio, id_emprendimiento, valoracion, comentario } = req.body;
    // Validar que solo se comente un tipo
    if ((!id_producto_servicio && !id_emprendimiento) || 
        (id_producto_servicio && id_emprendimiento)) {
      return res.status(400).json({ error: 'Debe seleccionar un producto/servicio O un emprendimiento' });
    }

    // Verificar si ya comentó
    const alreadyReviewed = await Reseña.userHasReviewed({
      id_usuario: req.usuario.id,
      id_producto_servicio,
      id_emprendimiento
    });
    // Si ya dejó una reseña, no permitir crear otra

    if (alreadyReviewed) {
      return res.status(400).json({ error: 'Ya has dejado una reseña para este item' });
    }

    // Crear la reseña
    const id = await Reseña.create({
      id_usuario: req.usuario.id,
      id_producto_servicio,
      id_emprendimiento,
      valoracion,
      comentario
    });
    console.log('Reseña creada con ID:', id);

    res.status(201).json({ 
      message: 'Reseña creada exitosamente',
      id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reseña' });
  }
};

// verificar si ya comento
exports.verificar = async (req, res) => {
  const id_usuario = req.usuario.id;
  const { tipo, id } = req.query;

  if (!tipo || !id) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const ya = await Reseña.userHasReviewed({
    id_usuario,
    id_emprendimiento: tipo === 'emprendimiento' ? id : null,
    id_producto_servicio: tipo === 'producto' ? id : null,
  });

  return res.json({ yaComento: ya });
};



// Obtener reseñas de producto
exports.getByProducto = async (req, res) => {
  try {
    const reseñas = await Reseña.findByProducto(req.params.id);
    res.json(reseñas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

// Obtener reseñas de emprendimiento
exports.getByEmprendimiento = async (req, res) => {
  try {
    const reseñas = await Reseña.findByEmprendimiento(req.params.id);
    res.json(reseñas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

// Obtener reseñas para dashboard emprendedor
exports.getForEmprendedor = async (req, res) => {
  try {
    if (req.usuario.rol !== 'emprendedor') {
      return res.status(403).json({ error: 'Acceso solo para emprendedores' });
    }

    const reseñas = await Reseña.findForEmprendedor(req.usuario.id);
    res.json(reseñas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

// Obtener reseñas para dashboard emprendedor
exports.getDashboard = async (req, res) => {
  try {
    if (req.usuario.rol !== 'emprendedor') {
      return res.status(403).json({ 
        success: false,
        error: 'Acceso solo para emprendedores' 
      });
    }

    const { tipo, orden, valoracion, page = 1 } = req.query;

    // Obtener datos
    const [reseñas, stats] = await Promise.all([
      Reseña.getForEmprendedor(req.usuario.id, {
        tipo,
        orden,
        valoracion,
        page,
        perPage: 10
      }),
      Reseña.getStats(req.usuario.id)
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          ...stats,
          promedio: parseFloat(stats.promedio) || 0
        },
        reseñas,
        pagination: {
          currentPage: parseInt(page),
          totalItems: stats.total_reseñas,
          totalPages: Math.ceil(stats.total_reseñas / 10)
        }
      }
    });

  } catch (error) {
    console.error('Error en dashboard de reseñas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener reseñas'
    });
  }
};