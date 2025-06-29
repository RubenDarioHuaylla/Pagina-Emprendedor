const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // 1. Obtener el token del header 'Authorization'
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // 2. Si no hay token, denegar acceso
  if (!token) {
    return res.status(401).json({ 
      error: 'Acceso denegado. Token no proporcionado' 
    });
  }

  try {
    // 3. Verificar el token usando tu clave secreta (guardada en .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Añadir los datos del usuario decodificados a la petición (req)
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    // 5. Continuar con la siguiente función (controlador)
    next();
  } catch (error) {
    // 6. Si el token es inválido o expiró
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
};