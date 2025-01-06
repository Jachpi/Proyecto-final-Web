const db = require('./db');
const bcrypt = require('bcrypt'); 

const User = {
  // Buscar usuario por email y comparar contraseñas
  findByEmailAndPassword: (email, password, callback) => {
    console.log('Consulta SQL (login):', email); 
    db.get(
      'SELECT IDUsuario, Email, Username, isApproved, Rol, Password FROM Usuarios WHERE Email = ?',
      [email],
      (err, row) => {
        if (err) {
          console.error('Error en la consulta SQL:', err.message);
          return callback(err, null);
        }

        if (!row) return callback(null, null); // Usuario no encontrado

        // Comparar la contraseña introducida con el hash
        bcrypt.compare(password, row.Password, (err, isMatch) => {
          if (err) {
            console.error('Error al comparar contraseñas:', err.message);
            return callback(err, null);
          }
          if (!isMatch) {
            console.log('Contraseña incorrecta para el usuario:', email);
            return callback(null, null); // Contraseña incorrecta
          }

          // Retorna los datos del usuario
          const user = {
            IDUsuario: row.IDUsuario,
            Email: row.Email,
            Username: row.Username,
            isApproved: row.isApproved,
            Rol : row.Rol
          };
          callback(null, user);
        });
      }
    );
  },

  // Registro de usuario con contraseña encriptada
  signup: (username, password, rol, email, callback) => { 
    console.log('Consulta SQL (signup):', username); 

    // Generar el hash de la contraseña
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error al encriptar la contraseña:', err.message);
        return callback(err);
      }

      // Insertar usuario en la base de datos
      db.run(
        'INSERT INTO Usuarios (Username, Password, Rol, Email, isApproved) VALUES (?, ?, ?, ?, ?)', 
        [username, hashedPassword, rol, email, 0], // isApproved inicializado en 0 (no aprobado)
        function(err) { 
          if (err) {
            console.error('Error en la consulta SQL (signup):', err.message);
            return callback(err);
          }
          console.log('Usuario insertado con ID:', this.lastID);
          callback(null);
        }
      );
    });
  }

};

module.exports = User;
