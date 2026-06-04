const { Router } = require('express');
const customerController = require('../controllers/customerController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, customerController.getAll);
router.get('/:id', requireAuth, customerController.getById);
router.post('/', requireAuth, customerController.create);
router.put('/:id', requireAuth, customerController.update);
router.delete('/:id', requireAuth, customerController.delete);

module.exports = router;
