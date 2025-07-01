// middlewares/upload.js
const multer = require('multer');
const path = require('path');

function crearUpload(subcarpeta = '', prefijo = 'img') {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join('public/uploads', subcarpeta));
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const nombre = `${prefijo}_${Date.now()}${ext}`;
      cb(null, nombre);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'), false);
  };

  return multer({ storage, fileFilter });
}

module.exports = crearUpload;
