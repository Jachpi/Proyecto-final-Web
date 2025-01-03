const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const multer = require('multer');
const upload = multer(); // sin opciones -> memoria / none

// Rutas para eventos
router.post('/calendar/items', eventController.events)
router.post('/create', upload.none(), eventController.createEvent) // Solo usuarios autenticados pueden crear eventos


module.exports = router;