const db = require('./db');

const Admin = {
    getEventosPendientes: (callback) => {
        const query = `
          SELECT * FROM Evento WHERE Estado = 'Pendiente' ORDER BY FechaHora ASC`;
    
        db.all(query, [], (err, rows) => {
          if (err) {
            console.error('Error en la consulta SQL:', err.message);
            return callback(err, null);
          }
    
          if (!rows) {
            return callback(null, []);
          }
          return callback(null, rows);
        });
      },
      getEventosAprobados: (callback) => {
        const query = `
          SELECT * FROM Evento WHERE Estado = 'Aprobado' ORDER BY FechaHora ASC`;
    
        db.all(query, [], (err, rows) => {
          if (err) {
            console.error('Error en la consulta SQL:', err.message);
            return callback(err, null);
          }
    
          if (!rows) {
            return callback(null, []);
          }
          return callback(null, rows);
        });
    }
};

module.exports = Admin;