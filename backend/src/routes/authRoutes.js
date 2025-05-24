const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 🔐 Rutas estándar RESTful
router.post('/login', authController.login);
router.post('/register', authController.register);

// 🔁 Rutas directas para compatibilidad con frontend legacy
router.post('/login', authController.login);
router.post('/register', authController.register);

// Manejo especial si se monta en raíz (/)
router.post('/', (req, res, next) => {
  if (req.originalUrl === '/login') {
    return authController.login(req, res, next);
  }
  if (req.originalUrl === '/register') {
    return authController.register(req, res, next);
  }
  return res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = router;

