const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middlewares/adminAuth');

router.get('/stats', adminAuth, adminController.getStats);
router.post('/users', adminAuth, adminController.createUser);

module.exports = router;
