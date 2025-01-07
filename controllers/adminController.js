const Admin = require('../model/Admin');

exports.getEventos = (req, res) => {
    Admin.getEventosPendientes((err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      return res.status(200).json(rows);
    });
  };
  
exports.getEventosAprobados = (req, res) => {
    Admin.getEventosAprobados((err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      return res.status(200).json(rows);
    });
  };

  exports.eliminarEvento = (req, res) => {
    const {id} = req.body;
    Admin.eliminarEvento(id,(err) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      return res.status(200).json({ success: true, message: 'Evento eliminado exitosamente.' });
    });
  };

  exports.aprobarEvento = (req, res) => {
    const {id} = req.body;
    Admin.aprobarEvento(id,(err) => {
      if (err) {
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      return res.status(200).json({ success: true, message: 'Evento eliminado exitosamente.' });
    });
  };
  