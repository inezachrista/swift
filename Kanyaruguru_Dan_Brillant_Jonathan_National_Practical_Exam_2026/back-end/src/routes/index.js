const { Router } = require('express');
const authRoutes = require('./auth');
const customerRoutes = require('./customers');
const vehicleRoutes = require('./vehicles');
const reservationRoutes = require('./reservations');
const userRoutes = require('./users');

const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/reservations', reservationRoutes);
router.use('/users', userRoutes);

module.exports = router;
