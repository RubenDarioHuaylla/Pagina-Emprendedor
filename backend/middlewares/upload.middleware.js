const multer = require('multer');
const path = require('path');

// Carpeta donde se guardarán las imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // crea esta carpeta si no existe
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const nombre = `logo_${Date.now()}${ext}`;
    cb(null, nombre);
  }
});

// Filtros opcionales: solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Solo se permiten imágenes'), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
