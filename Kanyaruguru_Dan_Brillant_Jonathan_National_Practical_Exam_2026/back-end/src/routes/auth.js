const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post('/signup', authController.signup);
router.post('/customer-signup', authController.customerSignup);
router.post('/login', authController.login);
router.post('/customer-login', authController.customerLogin);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', authController.me);

module.exports = router;