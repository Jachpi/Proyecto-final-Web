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
      SELECT Nombre, Descripcion, Imagen, FechaHora, FechaHoraFin, Username, Categoria, Ubicacion ,Estado FROM Evento JOIN Usuarios WHERE IDEvento = ?
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

  getEventByName: (name, callback) => {
    const query = `
    SELECT * FROM Evento
    WHERE Nombre COLLATE utf8mb4_general_ci LIKE ? AND Estado != 'Pendiente'
    ORDER BY FechaHora ASC
  `;
  db.all(query, [`%${name}%`], (err, rows) => {
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
  },

  /**
   * @param {object} evento - Objeto con los datos del evento.
   * @param {function} callback - Función que maneja el resultado (err).
   */
  crearEvento: (evento, callback) => {
    // Consulta de INSERT con todas las columnas que quieres rellenar manualmente
    const query = `
      INSERT INTO Evento
      (Nombre, Descripcion, Imagen, FechaHora, FechaHoraFin, IDOwner, Categoria, Estado, Ubicacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      evento.estado,
      evento.ubicacion
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
  isOwner: (idEvento, userId, callback) => {
    db.get(
      'SELECT Rol FROM Usuarios WHERE IDUsuario = ?',
      [userId],
      (err, user) => {
        if (err) {
          console.error('Error en la consulta SQL de isOwner (verificar rol):', err.message);
          return callback(err, null);
        }
  
        // Si el usuario es Admin, devolver true directamente
        if (user && user.Rol === 'Admin') {
          return callback(null, true);
        }
  
        // Si no es Admin, verificar si es dueño del evento
        db.get(
          'SELECT 1 FROM Evento WHERE idEvento = ? AND idOwner = ?',
          [idEvento, userId],
          (err, row) => {
            if (err) {
              console.error('Error en la consulta SQL de isOwner (verificar propietario):', err.message);
              return callback(err, null);
            }
            callback(null, !!row); // Devuelve true si el evento pertenece al usuario
          }
        );
      }
    );
  },  
  updateEvent: (idEvento, updatedEvent, callback) => {
    const { nombre, descripcion, imagen, fechaHora, fechaHoraFin, categoria, ubicacion } = updatedEvent;
  
    db.run(
      'UPDATE Evento SET nombre = ?, descripcion = ?, imagen = ?, fechaHora = ?, fechaHoraFin = ?, categoria = ?, ubicacion = ? WHERE idEvento = ?',
      [nombre, descripcion, imagen, fechaHora, fechaHoraFin, categoria, ubicacion, idEvento],
      function (err) {
        if (err) {
          console.error('Error en la consulta SQL de updateEvent:', err.message); // Log del error
          return callback(err);
        }
        console.log('Evento actualizado, cambios:', this.changes); // Verifica cuántas filas se actualizaron
        callback(null);
      }
    );
  }
  

};

module.exports = Evento;
