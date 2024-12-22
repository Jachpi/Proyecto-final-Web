const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para login
router.post('/login', authController.login);

// Ruta para signup
router.post('/signup', authController.signup);

// Ruta para logout
router.post('/logout', authController.logout);

module.exports = router;
