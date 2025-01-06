const db = require('./db'); // Ajusta la ruta si está en otro lugar

const Evento = {
  /**
   * Obtiene los eventos que coincidan con la fecha (parcial)
   * en la columna FechaHora (usando LIKE '%...%').
   * @param {string} date - Cadena parcial de fecha (ej. '2025-01' o '2025-01-03').
   * @param {function} callback - Función que maneja el resultado (err, rows).
   */
  getCalendarEvents: (date, callback) => {
    // Primero actualizamos el estado de los eventos pasados
    // Como estamos usando SQLite y no se pueden hacer triggers de tiempo, lo hacemos cada vez que un usuario acceda a la lista de eventos
    // En caso de usar MySQL o PostgreSQL, se puede hacer un trigger que actualice el estado automáticamente y que consume mucha menos memoria
    const updateQuery = `
      UPDATE Evento
      SET Estado = 'Terminado'
      WHERE FechaHora < datetime('now') AND Estado != 'Terminado'
    `;
  
    db.run(updateQuery, [], (updateErr) => {
      if (updateErr) {
        console.error('Error al actualizar estados de eventos:', updateErr.message);
        return callback(updateErr, null);
      }
  
      // Luego obtenemos los eventos según el filtro de fecha
      const selectQuery = `
        SELECT * FROM Evento
        WHERE FechaHora LIKE ? AND Estado != 'Pendiente'
        ORDER BY FechaHora ASC
      `;
      db.all(selectQuery, [`%${date}%`], (err, rows) => {
        if (err) {
          console.error('Error en la consulta SQL:', err.message);
          return callback(err, null);
        }
  
        // 'rows' será un array (vacío si no hay resultados)
        if (!rows) {
          return callback(null, []);
        }
        return callback(null, rows);
      });
    });
  },
  

  getIdEvent: (id, callback) => {
    const query = `
      SELECT Nombre, Descripcion, Imagen, FechaHora, FechaHoraFin, Username, Categoria, Estado FROM Evento JOIN Usuarios WHERE IDEvento = ?
    `;
    db.get(query, id, (err, res) => {
      if (err) {
        console.error('Error en la consulta SQL:', err.message);
        return callback(err, null);
      }else if(res){
        return callback(null, res)
      }else{
        return callback(null, null)
      }
    })
  },

  /**
   * @param {object} evento - Objeto con los datos del evento.
   * @param {function} callback - Función que maneja el resultado (err).
   */
  crearEvento: (evento, callback) => {
    // Consulta de INSERT con todas las columnas que quieres rellenar manualmente
    const query = `
      INSERT INTO Evento
      (Nombre, Descripcion, Imagen, FechaHora, FechaHoraFin, IDOwner, Categoria, Estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Prepara el array de parámetros en el orden exacto que pusiste en la consulta
    const params = [
      evento.nombre,
      evento.descripcion,
      evento.imagen,
      evento.fechaHora,
      evento.fechaHoraFin,
      evento.idOwner,
      evento.categoria,
      evento.estado
    ];

    db.run(query, params, function (err) {
      if (err) {
        console.error('Error en la consulta SQL:', err.message);
        return callback(err);
      }
      // this.lastID te da el último ID autogenerado en SQLite
      console.log('Evento creado con ID:', this.lastID);
      return callback(null);
    });
  },
  getEventosPendientes: (callback) => {
    const query = `
      SELECT * FROM Evento WHERE Estado = 'Pendiente' ORDER BY FechaHora ASC`;

    db.get(query, (err, rows) => {
      if (err) {
        console.error('Error en la consulta SQL:', err.message);
        return callback(err, null);
      }

      if (!rows) {
        return callback(null, null);
      }
      return callback(null, rows);
    });
  }

};

module.exports = Evento;
