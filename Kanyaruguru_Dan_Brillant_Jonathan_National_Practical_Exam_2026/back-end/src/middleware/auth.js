const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized. Please login.' });
};

const requireCustomerAuth = (req, res, next) => {
  if (req.session && req.session.customer) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized. Please login as a customer.' });
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }
    if (!roles.includes(req.session.user.Role)) {
      return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { requireAuth, requireCustomerAuth, requireRole };