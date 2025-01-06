const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const multer = require('multer');
const upload = multer(); // sin opciones -> memoria / none
const fetch = require('node-fetch');


// Rutas para eventos
router.post('/calendar/items', eventController.events)
router.post('/idEvent', eventController.getIdEvent)
router.post('/calendar/nameEvent', eventController.getEventByName)
router.post('/create', upload.none(), eventController.createEvent) // Solo usuarios autenticados pueden crear eventos
router.post('/upload-image', upload.single('imagen'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // el archivo en memoria
    // OJO: la API de freeimage.host espera 'source' en multipart.
    // Podrías usar form-data de node-fetch:
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('source', fileBuffer, { filename: req.file.originalname });

    const API_KEY = '6d207e02198a847aa98d0a2a901485a5';
    const response = await fetch(`https://freeimage.host/api/1/upload?key=${API_KEY}&format=json`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error al subir a Freeimage.host:', error);
    return res.status(500).json({ error: 'No se pudo subir la imagen' });
  }
});


module.exports = router;