const { Router } = require('express');
const vehicleController = require('../controllers/vehicleController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, vehicleController.getAll);
router.get('/:id', requireAuth, vehicleController.getById);
router.post('/', requireAuth, vehicleController.create);
router.put('/:id', requireAuth, vehicleController.update);
router.delete('/:id', requireAuth, vehicleController.delete);

module.exports = router;
