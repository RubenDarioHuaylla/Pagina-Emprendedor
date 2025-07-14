const express = require('express');
const router = express.Router();
const controller = require('../controllers/producto_servicio.controller');
const auth = require('../middlewares/auth.middleware');

// Middleware para subir imágenes
const crarUpload = require('../middlewares/upload.middleware')
const upload = crarUpload('productos', 'producto');



// Lista los productos/servicios de un emprendimiento
router.get('/mis-productos', auth, controller.listarMisProductosServicios);

// crea un nuevo producto/servicio
router.post('/', auth, upload.single('imagen'), controller.crearProductoServicio);

// Actualiza un producto/servicio
router.put('/:id', auth, upload.single('imagen'),controller.actualizarProductoServicio);

// Obtiene un producto/servicio por ID
router.get('/mis-productos/:id', auth, controller.verProductoPorId);

// eliminar
router.delete('/:id', auth, controller.eliminarProductoServicio);

// para el publico
router.get('/', controller.listarProductosServicios);
router.get('/:id', controller.detalleProductoServicio);



module.exports = router;