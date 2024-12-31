const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next(); // El usuario está autenticado
    }
    return res.status(401).json({ error: 'Acceso denegado, no estás autenticado' });
};

// Rutas para eventos
router.post('/calendar/items', eventController.events)
router.post('/create', isAuthenticated, eventController.createEvent) // Solo usuarios autenticados pueden crear eventos


module.exports = router;