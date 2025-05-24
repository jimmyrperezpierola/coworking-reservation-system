const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');
const authenticate = require('../middlewares/authenticate');
const adminAuth = require('../middlewares/adminAuth');

router.get('/', spaceController.getAll);
router.get('/enabled', spaceController.getEnabled);
router.get('/:id', spaceController.getById);
router.post('/', adminAuth, spaceController.create);
router.put('/:id', adminAuth, spaceController.update);
router.patch('/:id/rate', adminAuth, spaceController.updateRate);
router.delete('/:id', adminAuth, spaceController.remove);
router.post('/:id/reserve', spaceController.reserve);

module.exports = router;
