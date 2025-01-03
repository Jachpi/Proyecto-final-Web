const db = require('./db'); // Ajusta la ruta si está en otro lugar

const Evento = {
  /**
   * Obtiene los eventos que coincidan con la fecha (parcial)
   * en la columna FechaHora (usando LIKE '%...%').
   * @param {string} date - Cadena parcial de fecha (ej. '2025-01' o '2025-01-03').
   * @param {function} callback - Función que maneja el resultado (err, rows).
   */
  getCalendarEvents: (date, callback) => {
    const query = `
      SELECT * FROM Evento
      WHERE FechaHora LIKE ?
      ORDER BY FechaHora ASC
    `;
    db.all(query, [`%${date}%`], (err, rows) => {
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
  }
};

module.exports = Evento;
