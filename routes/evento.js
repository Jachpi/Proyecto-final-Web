const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const multer = require('multer');
const upload = multer(); // Memoria / none

// Rutas para eventos
router.post('/calendar/items', eventController.events);
router.post('/idEvent', eventController.getIdEvent);
router.post('/calendar/nameEvent', eventController.getEventByName);
router.post('/create', upload.none(), eventController.createEvent);
router.post('/isOwner', eventController.isOwner);
router.get('/editar/:id', eventController.renderEditForm);
router.post('/edit', eventController.editEvent);
router.get('/get/:id', eventController.getEventById);
router.post('/upload-image', upload.single('imagen'), eventController.uploadImage);

module.exports = router;
