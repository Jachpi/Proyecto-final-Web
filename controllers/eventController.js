const Event = require('../model/Evento');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

exports.events = (req, res) => {
  const { date, type } = req.body;
  let filteredDate;

  if (type === 'month') {
    filteredDate = date.substring(0, 7);
  } else if (type === 'day') {
    filteredDate = date.substring(0, 10);
  }

  Event.getCalendarEvents(filteredDate, (err, events) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(events);
  });
};

exports.getIdEvent = (req, res) => {
  const { id } = req.body;
  Event.getIdEvent(id, (err, evento) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(evento);
  });
};

exports.getEventByName = (req, res) => {
  const { name } = req.body;
  Event.getEventByName(name, (err, events) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(events);
  });
};

exports.createEvent = (req, res) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const { nombre, descripcion, imagen, fechaHora, fechaHoraFin, categoria, ubicacion } = req.body;
  const userId = req.session.userId;

  const nuevoEvento = {
    nombre,
    descripcion,
    imagen: imagen || null,
    fechaHora,
    fechaHoraFin,
    idOwner: userId,
    categoria,
    estado: 'Pendiente',
    ubicacion,
  };

  Event.crearEvento(nuevoEvento, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(201).json({ success: true, message: 'Evento creado exitosamente' });
  });
};

exports.isOwner = (req, res) => {
  const { idEvento } = req.body;
  const userId = req.session?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'No has iniciado sesión.' });
  }

  Event.isOwner(idEvento, userId, (err, isOwner) => {
    if (err) {
      return res.status(500).json({ error: 'Error al verificar permisos.' });
    }
    return res.status(200).json({ isOwner });
  });
};

exports.renderEditForm = (req, res) => {
  const { id } = req.params;
  res.sendFile(path.join(__dirname, '../public/eventoform.html'));
};

exports.getEventById = (req, res) => {
  const { id } = req.params;

  Event.getIdEvent(id, (err, evento) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(200).json(evento);
  });
};

exports.uploadImage = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const formData = new FormData();
    formData.append('source', fileBuffer, { filename: req.file.originalname });

    const API_KEY = '6d207e02198a847aa98d0a2a901485a5';
    const response = await fetch(`https://freeimage.host/api/1/upload?key=${API_KEY}&format=json`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo subir la imagen' });
  }
};

exports.editEvent = (req, res) => {
  const { idEvento, nombre, descripcion, imagen, fechaHora, fechaHoraFin, categoria, ubicacion } = req.body;

  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const userId = req.session.userId;

  Event.isOwner(idEvento, userId, (err, isOwner) => {
    if (err) {
      return res.status(500).json({ error: 'Error al verificar propietario del evento.' });
    }

    if (!isOwner) {
      return res.status(403).json({ error: 'No tienes permiso para editar este evento.' });
    }

    const updatedEvent = { nombre, descripcion, imagen, fechaHora, fechaHoraFin, categoria, ubicacion };

    Event.updateEvent(idEvento, updatedEvent, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor.' });
      }
      return res.status(200).json({ success: true, message: 'Evento actualizado exitosamente.' });
    });
  });
};
