const db = require('./db');

const Evento = {
      // Obtención de los eventos en el margen de días solicitado
  getCalendarEvents: (date, callback) => {
    db.all('SELECT * FROM Evento WHERE FechaHora LIKE ? ORDER BY FechaHora ASC',
      ['%'+date+'%'],
      (err, res) => {
        if (err) {
          console.error('Error en la consulta SQL:', err.message);
          return callback(err, null);
        }

        if (!res){
          return callback(null, []);
        }
        
        return callback(null, res)
    })
  }
};

module.exports = Evento;