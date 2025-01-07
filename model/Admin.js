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
    },
    eliminarEvento: (id, callback) => {
      const query = `
        DELETE FROM Evento WHERE IDEvento = ?`;
  
      db.run(query, id, (err) => {
        if (err) {
          console.error('Error en la consulta SQL:', err.message);
          return callback(err, null);
        }
        console.log('Evento eliminado ');
        return callback(null);
      });
  },
  aprobarEvento: (id, callback) => {
    const query = `
      UPDATE Evento SET Estado = 'Aprobado' WHERE IDEvento = ?`;

    db.run(query, id, (err) => {
      if (err) {
        console.error('Error en la consulta SQL:', err.message);
        return callback(err, null);
      }
      console.log('Evento aprobado');
      return callback(null);
    });
  }
};

module.exports = Admin;