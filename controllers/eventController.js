const Event = require('../model/Evento');

exports.events = (req, res) => {
    const {date, type} = req.body
    let filteredDate
    if (type == "month"){
      filteredDate = date.substring(0,7)
      console.log("Searching for events from", filteredDate+"-XX")
    } else if(type == "day"){
      filteredDate = date.substring(0,10)
      console.log("Searching for events from", filteredDate)
    }
    Event.getCalendarEvents(filteredDate, (err, events) => {
      if(err){
        return res.status(500).json({error: "Error interno del servidor"})
      }
      return res.status(200).json(events);
    })
}

exports.createEvent = (req, res) => {
  const evento = req.body;
  if (evento.date && new Date(evento.date) < new Date()) {
    return res.status(400).json({ error: 'La fecha del evento no puede ser anterior a hoy' });
  }
  Event.crearEvento(evento, (err) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    return res.status(201).json({ success: true, message: 'Evento creado exitosamente' });
  });

}