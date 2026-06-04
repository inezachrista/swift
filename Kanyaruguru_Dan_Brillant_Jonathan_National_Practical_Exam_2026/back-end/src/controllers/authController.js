const User = require('../models/User');
const Customer = require('../models/Customer');

const authController = {
  async signup(req, res) {
    try {
      const { UserName, Password, Role } = req.body;
      if (!UserName || !Password) {
        return res.status(400).json({ message: 'Username and password are required.' });
      }
      const existing = await User.findByUsername(UserName);
      if (existing) {
        return res.status(409).json({ message: 'Username already exists.' });
      }
      const user = await User.create({ UserName, Password, Role });
      return res.status(201).json({ message: 'User created successfully.', user });
    } catch (error) {
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

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

  async customerSignup(req, res) {
    try {
      const { Full_Name, National_ID, Phone, Email, Address, Password } = req.body;
      if (!Full_Name || !National_ID || !Phone || !Password) {
        return res.status(400).json({ message: 'Full Name, National ID, Phone, and Password are required.' });
      }
      const existing = await Customer.findByNationalId(National_ID);
      if (existing) {
        return res.status(409).json({ message: 'National ID already registered.' });
      }
      const customer = await Customer.create(req.body);
      return res.status(201).json({ message: 'Account created successfully.', customer });
    } catch (error) {
      console.error('Customer signup error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'National ID already exists.' });
      }
      if (error.code === 'ER_BAD_FIELD_ERROR' || error.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ message: 'Database configuration error. Please ensure the database is set up.' });
      }
      return res.status(500).json({ message: 'Server error.', error: error.message });
    }
  },

  async customerLogin(req, res) {
    try {
      const { National_ID, Password } = req.body;
      if (!National_ID || !Password) {
        return res.status(400).json({ message: 'National ID and password are required.' });
      }

      const customer = await Customer.findByNationalId(National_ID);
      if (!customer) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const isValid = await Customer.validatePassword(Password, customer.Password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      req.session.customer = {
        id: customer.id,
        Full_Name: customer.Full_Name,
        National_ID: customer.National_ID
      };

      return res.status(200).json({
        message: 'Login successful.',
        customer: { id: customer.id, Full_Name: customer.Full_Name, National_ID: customer.National_ID }
      });
    } catch (error) {
      console.error('Customer login error:', error);
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
    if (req.session && req.session.customer) {
      return res.status(200).json({ customer: req.session.customer });
    }
    return res.status(401).json({ message: 'Not authenticated.' });
  }
};

module.exports = authController;