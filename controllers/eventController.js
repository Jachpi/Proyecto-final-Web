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

exports.getIdEvent = (req, res) => {
  const {id} = req.body;
  Event.getIdEvent(id, (err, evento) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(evento);
  })
}

exports.getEventByName = (req, res) => {
  const {name} = req.body;
  console.log("Searching events with name:",name)
  Event.getEventByName(name, (err, events) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(events);
  })
}

exports.createEvent = (req, res) => {
  console.log('req.body:', req.body);
  console.log('Sesión en createEvent:', req.session);

  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  // Extraemos los campos que llegan en el body
  const { 
    nombre, 
    descripcion, 
    imagen, 
    fechaHora,      // p. ej. "2025-01-01 22:00:00"
    fechaHoraFin, 
    categoria 
  } = req.body;

  const userId = req.session.userId;

  // Verificar que la fechaHora no sea anterior a la fecha/hora actual
  if (fechaHora) {
    const fechaEvento = new Date(fechaHora);  // Convierto a objeto Date
    const ahora = new Date();
    
    // Si el evento inicia antes que "ahora", regresamos error
    if (fechaEvento < ahora) {
      return res.status(400).json({ error: 'La fecha/hora del evento no puede ser anterior a la actual' });
    }
  }

  // Construimos el objeto que insertaremos en la base de datos
  const nuevoEvento = {
    nombre,
    descripcion,
    imagen: imagen || null,
    fechaHora,
    fechaHoraFin,
    idOwner: userId,
    categoria,
    estado: 'Pendiente',
  };

  Event.crearEvento(nuevoEvento, (err) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(201).json({ success: true, message: 'Evento creado exitosamente' });
  });
  
};

exports.getEventos = (req, res) => {
  Event.getEventosPendientes((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(rows);
  });
};

exports.getEventosAprobados = (req, res) => {
  Event.getEventosAprobados((err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(rows);
  });
};