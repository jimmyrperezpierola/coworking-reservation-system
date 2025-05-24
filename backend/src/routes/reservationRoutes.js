const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, reservationController.getAll);
//router.get('/', reservationController.getAll);
router.post('/', reservationController.create);
router.put('/:id/cancel', reservationController.cancel);

module.exports = router;
