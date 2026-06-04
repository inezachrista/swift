const User = require('../models/User');

const userController = {
  async getAll(req, res) {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { UserName, Password, Role } = req.body;
      if (!UserName || !Password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }
      const existing = await User.findByUsername(UserName);
      if (existing) {
        return res.status(409).json({ message: 'Username already exists.' });
      }
      const user = await User.create(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const existing = await User.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const user = await User.update(req.params.id, req.body);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await User.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  }
};

module.exports = userController;