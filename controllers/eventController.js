const Event = require('../model/Evento');

exports.events = (req, res) => {
  const { date, type } = req.body;
  let filteredDate;

  if (type === 'month') {
    filteredDate = date.substring(0, 7);
    console.log('Searching for events from', filteredDate + '-XX');
  } else if (type === 'day') {
    filteredDate = date.substring(0, 10);
    console.log('Searching for events from', filteredDate);
  }

  Event.getCalendarEvents(filteredDate, (err, events) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(events);
  });
};

exports.createEvent = (req, res) => {
  console.log('req.body:', req.body);  // Debería tener { nombre, descripcion, fecha, horaInicio, horaFin, categoria, imagen, ... }
  console.log('Sesión en createEvent:', req.session);

  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const { nombre, descripcion, fecha, horaInicio, horaFin, categoria, imagen } = req.body;
  const userId = req.session.userId;

  if (fecha && new Date(fecha) < new Date()) {
    return res.status(400).json({ error: 'La fecha del evento no puede ser anterior a hoy' });
  }

  // Combinar fecha y horas:
  const fechaHoraInicio = `${evento.fecha} ${evento.horaInicio}:00`;
  const fechaHoraFin = `${evento.fecha} ${evento.horaFin}:00`;

  const nuevoEvento = {
    nombre,
    descripcion,
    imagen: imagen || null, // Aquí tienes la cadena Base64 u otro texto
    fechaHora: fechaHoraInicio,
    fechaHoraFin: fechaHoraFin,
    idOwner: userId,
    categoria,
    estado: 'Pendiente', // o lo que quieras
  };

  // Insertar en la base de datos
  Event.crearEvento(nuevoEvento, (err) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(201).json({ success: true, message: 'Evento creado exitosamente' });
  });
};

