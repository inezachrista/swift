const { Router } = require('express');
const reservationRentalController = require('../controllers/reservationRentalController');
const { requireAuth, requireCustomerAuth } = require('../middleware/auth');

const router = Router();

router.get('/my', requireCustomerAuth, reservationRentalController.getMyReservations);
router.get('/report', requireAuth, reservationRentalController.getReport);
router.get('/', requireAuth, reservationRentalController.getAll);
router.get('/:id', requireAuth, reservationRentalController.getById);
router.post('/', requireAuth, reservationRentalController.create);
router.put('/:id', requireAuth, reservationRentalController.update);
router.delete('/:id', requireAuth, reservationRentalController.delete);

module.exports = router;