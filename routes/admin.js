const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para admin
router.get('/eventospendientes', authMiddleware, adminController.getEventos)
router.get('/eventosaprobados', authMiddleware, adminController.getEventosAprobados)
router.delete('/eliminar', authMiddleware, adminController.eliminarEvento)
router.post('/aprobar', authMiddleware, adminController.aprobarEvento)
router.get('/usuarios', authMiddleware, adminController.getUsuariosPendientes)
router.post('/aprobarusuario', authMiddleware, adminController.aprobarUsuario)


module.exports = router;