const Vehicle = require('../models/Vehicle');

const vehicleController = {
  async getAll(req, res) {
    try {
      const vehicles = await Vehicle.findAll();
      return res.status(200).json(vehicles);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found.' });
      }
      return res.status(200).json(vehicle);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price } = req.body;
      if (!Plate_Number || !Brand || !Model || !Year || !Vehicle_Type || !Purchase_Price) {
        return res.status(400).json({ message: 'All vehicle fields are required.' });
      }
      const vehicle = await Vehicle.create(req.body);
      return res.status(201).json(vehicle);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Plate_Number already exists.' });
      }
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const existing = await Vehicle.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'Vehicle not found.' });
      }
      const vehicle = await Vehicle.update(req.params.id, req.body);
      return res.status(200).json(vehicle);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Vehicle.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Vehicle not found.' });
      }
      return res.status(200).json({ message: 'Vehicle deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  }
};

module.exports = vehicleController;
