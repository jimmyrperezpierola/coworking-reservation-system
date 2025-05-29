const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

router.get('/me', authenticate, userController.getCurrentUser);
router.patch('/me', authenticate, userController.updateCurrentUser);
router.delete('/me', authenticate, userController.deleteCurrentUser);

module.exports = router;
