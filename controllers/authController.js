const User = require('../model/Usuario');

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmailAndPassword(email, password, (err, user) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Guardar datos en la sesión
    req.session.userId = user.IDUsuario;
    req.session.email = user.Email;
    req.session.isApproved = user.isApproved;
    req.session.rol = user.Rol; // Agregar el rol del usuario

    console.log('Inicio de sesión exitoso para:', user);

    if (!user.isApproved) {
      return res.status(403).json({ error: 'Usuario no aprobado' });
    }

    // Redirigir según el rol del usuario
    if (user.Rol === 'Admin') {
      return res.status(200).json({ success: true, redirect: '/inicioadmin.html' });
    }

    // Redirigir para otros roles (por ejemplo, usuarios normales)
    return res.status(200).json({ success: true, redirect: '/inicio.html' });
  });
};


exports.signup = (req, res) => {
  const {
    email,
    'new-password': password,
    'new-username': username,
    tipo: rol
  } = req.body;

  console.log('Datos recibidos en /signup:', email, password, username, rol);

  // Validar los datos de entrada
  if (!email || !password || !username || !rol) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  // Registrar usuario
  User.signup(username, password, rol, email, (err) => { // Orden corregido
    if (err) {
      console.error('Error al registrar el usuario:', err.message);
      return res.status(409).json({ error: 'El usuario ya existe' }); // Respuesta JSON
    }
    console.log('Usuario registrado correctamente');
    return res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ success: true, message: 'Sesión cerrada exitosamente' });
  });
};
