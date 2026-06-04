const { Router } = require('express');
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, userController.getAll);
router.get('/:id', requireAuth, userController.getById);
router.post('/', requireAuth, userController.create);
router.put('/:id', requireAuth, userController.update);
router.delete('/:id', requireAuth, userController.delete);

module.exports = router;