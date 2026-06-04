const ReservationRental = require('../models/ReservationRental');

const reservationRentalController = {
  async getMyReservations(req, res) {
    try {
      const customerId = req.session.customer.id;
      const reservations = await ReservationRental.findByCustomer(customerId);
      return res.status(200).json(reservations);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const { search } = req.query;
      const reservations = await ReservationRental.findAll(search);
      return res.status(200).json(reservations);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const reservation = await ReservationRental.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found.' });
      }
      return res.status(200).json(reservation);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { customer_id, vehicle_id, Start_Date, End_Date } = req.body;
      if (!customer_id || !vehicle_id || !Start_Date || !End_Date) {
        return res.status(400).json({ message: 'customer_id, vehicle_id, Start_Date, and End_Date are required.' });
      }
      const data = {
        ...req.body,
        user_id: req.session.user.id
      };
      const reservation = await ReservationRental.create(data);
      return res.status(201).json(reservation);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const existing = await ReservationRental.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'Reservation not found.' });
      }
      const reservation = await ReservationRental.update(req.params.id, req.body);
      return res.status(200).json(reservation);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await ReservationRental.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Reservation not found.' });
      }
      return res.status(200).json({ message: 'Reservation deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  }
};

module.exports = reservationRentalController;
