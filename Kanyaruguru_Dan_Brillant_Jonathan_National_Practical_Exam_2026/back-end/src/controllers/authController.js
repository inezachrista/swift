const User = require('../models/User');

const authController = {
  async login(req, res) {
    try {
      const { UserName, Password } = req.body;
      if (!UserName || !Password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }

      const user = await User.findByUsername(UserName);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const isValid = await User.validatePassword(Password, user.Password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      req.session.user = {
        id: user.id,
        UserName: user.UserName,
        Role: user.Role
      };

      return res.status(200).json({
        message: 'Login successful.',
        user: { id: user.id, UserName: user.UserName, Role: user.Role }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed.', error: err.message });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logout successful.' });
    });
  },

  async me(req, res) {
    if (req.session && req.session.user) {
      return res.status(200).json({ user: req.session.user });
    }
    return res.status(401).json({ message: 'Not authenticated.' });
  }
};

module.exports = authController;
