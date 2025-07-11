module.exports = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'Acceso denegado: Debes iniciar sesión' 
      });
    }
    
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        success: false,
        message: 'Acceso denegado: Rol no autorizado' 
      });
    }
    
    next();
  };
};