module.exports = (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.session.userId) {
      return res.status(401).json({ error: 'No has iniciado sesión.' });
    }
  
    // Verificar si el usuario tiene el rol de administrador
    if (req.session.rol !== 'Admin') {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta.' });
    }
  
    // Si pasa las verificaciones, continúa con la solicitud
    next();
  };
  