const authenticate = require('./authenticate');

module.exports = [
  authenticate,
  (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Acceso restringido a administradores' });
    }
    next();
  }
];
