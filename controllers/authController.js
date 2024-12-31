const User = require('../model/Usuario');

exports.login = (req, res) => {
  const { email, password } = req.body; 

  console.log('Datos recibidos en /login:', email, password); 

  User.findByEmailAndPassword(email, password, (err, user) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message); 
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (!user) {
      console.log('Credenciales inválidas'); // Log si no se encuentra el usuario
      return res.status(401).json({ error: 'Credenciales inválidas' }); // Respuesta JSON
    }

    // Guardar datos en la sesión
    req.session.userId = user.IDUsuario; // Usar 'IDUsuario'
    req.session.email = user.Email; // Usar 'Email'
    req.session.isApproved = user.isApproved; // 'isApproved' es correcto

    console.log('Login exitoso para:', user);
    if (user.isApproved) {
      return res.status(200).json({ success: true, redirect: '/inicio.html' });
    }
    return res.status(403).json({ error: 'Usuario no aprobado' });
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

exports.events = (req, res) => {
  const {date, type} = req.body
  let filteredDate
  if (type == "month"){
    filteredDate = date.substring(0,7)
    console.log("Searching for events from", filteredDate+"-XX")
  }

  User.getCalendarEvents(filteredDate, (err, events) => {
    if(err){
      return res.status(500).json({error: "Error interno del servidor"})
    }
    return res.status(200).json(events);
  })
  
}
