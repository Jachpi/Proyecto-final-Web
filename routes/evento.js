const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Ruta para obtener eventos
router.post('/calendar/items', eventController.events)

module.exports = router;