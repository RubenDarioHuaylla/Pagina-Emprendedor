const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

// Registro de usuario
exports.registrar = async (req, res) => {
  try {
    console.log('Datos del registro:', req.body); // Debug: Verifica los datos recibidos
    const { nombre, apellido, email, password, rol } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const idUsuario = await Usuario.crear({ nombre, apellido, email, password, rol });
    res.status(201).json({ id: idUsuario, message: 'Usuario registrado' });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {   
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.buscarPorEmail(email); 

    if (!usuario || !(await Usuario.compararPassword(password, usuario.password_hash))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

  // generar un token JWT
  const token  = jwt.sign(  
    { id: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '6h' } // El token expirará en 6h hora
  );

  // Enviar el token al cliente
  res.json({ message: 'Login exitoso',token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Perfil (protegido)
// En controllers/auth.controller.js
exports.obtenerPerfil = async (req, res) => {
  try {
    console.log('Usuario del token:', req.usuario); // Debug: Verifica los datos del token
    // 1. Obtener ID del token decodificado (middleware ya verificó autenticación)
    const userId = req.usuario.id;

    // 2. Buscar usuario en BD (solo campos necesarios)
    const usuario = await Usuario.buscarPorId(userId, ['id', 'nombre', 'email', 'rol']); // Excluir password_hash

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 3. Responder con datos seguros
    res.json({
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      // Puedes añadir más campos si son públicos (ej: avatar_url)
    });

  } catch (error) {
    console.error('Error en obtenerPerfil:', error);
    res.status(500).json({ 
      error: 'Error al obtener perfil',
      detalles: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};