const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/User');

exports.getCurrentUser = (req, res) => {
  const { id, email, isAdmin, createdAt } = req.user;
  res.json({ id, email, isAdmin, createdAt });
};

exports.updateCurrentUser = async (req, res) => {
  const { email, password } = req.body;
  const updates = {};

  if (email) {
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Email inválido' });
    updates.email = email;
  }

  if (password) {
    if (password.length < 6) return res.status(400).json({ error: 'Contraseña muy corta' });
    updates.password = await bcrypt.hash(password, 10);
  }

  await User.update(updates, { where: { id: req.user.id } });
  const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  res.json({ message: 'Usuario actualizado', user: updated });
};

exports.deleteCurrentUser = async (req, res) => {
  await User.destroy({ where: { id: req.user.id }, force: true });
  res.json({ message: 'Cuenta eliminada correctamente' });
};
