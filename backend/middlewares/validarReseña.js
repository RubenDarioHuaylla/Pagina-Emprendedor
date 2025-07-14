const { check, validationResult } = require('express-validator');

exports.validarCrearReseña = [
  check('valoracion')
    .isInt({ min: 1, max: 5 })
    .withMessage('La valoración debe ser entre 1 y 5 estrellas'),
  
  check('comentario')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('El comentario no puede exceder 500 caracteres'),
  
  check('id_producto_servicio')
    .optional()
    .isInt()
    .toInt(),
    
  check('id_emprendimiento')
    .optional()
    .isInt()
    .toInt(),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array(),
        message: 'Error de validación'
      });
    }
    
    // Validar que solo un ID esté presente
    if (req.body.id_producto_servicio && req.body.id_emprendimiento) {
      return res.status(400).json({
        success: false,
        message: 'Solo se puede reseñar un producto o un emprendimiento, no ambos'
      });
    }
    
    next();
  }
];