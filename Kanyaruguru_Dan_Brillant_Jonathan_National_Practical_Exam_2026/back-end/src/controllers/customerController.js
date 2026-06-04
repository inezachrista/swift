const Customer = require('../models/Customer');

const customerController = {
  async getAll(req, res) {
    try {
      const { search } = req.query;
      const customers = await Customer.findAll(search);
      return res.status(200).json(customers);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      return res.status(200).json(customer);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { Full_Name, National_ID, Phone, Email, Address } = req.body;
      if (!Full_Name || !National_ID || !Phone) {
        return res.status(400).json({ message: 'Full_Name, National_ID, and Phone are required.' });
      }
      const customer = await Customer.create(req.body);
      return res.status(201).json(customer);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'National_ID already exists.' });
      }
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const existing = await Customer.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      const customer = await Customer.update(req.params.id, req.body);
      return res.status(200).json(customer);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await Customer.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Customer not found.' });
      }
      return res.status(200).json({ message: 'Customer deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  }
};

module.exports = customerController;
