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
  },
  crearEvento: (evento, callback) => {
    db.run('INSERT INTO Evento (Nombre, Descripcion, Imagen, FechaHora, IDOwner, Categoria, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [evento.nombre, evento.descripcion, evento.imagen, evento.fechaHora, evento.idOwner, evento.categoria, evento.estado],
      (err) => {
        if (err) {
          console.error('Error en la consulta SQL:', err.message);
          return callback(err);
        }

        return callback(null);
    });
  }
};

module.exports = Evento;