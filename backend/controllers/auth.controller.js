const Usuario = require('../models/usuario.model');

// Registro de usuario
exports.registrar = async (req, res) => {
  try {
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

    // Aquí generas un token JWT (lo veremos después)
    res.json({ message: 'Login exitoso', usuario: { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};