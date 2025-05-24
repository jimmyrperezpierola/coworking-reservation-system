const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');

exports.login = async (req, res) => {

 const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  const user = await User.findOne({ where: { email }, attributes: ['id', 'email', 'password', 'isAdmin']});
  if (!user) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ 
      succes: false,
      error: 'Contraseña incorrecta',
      code: 'AUTH_INVALID_CREDENTIALS'
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, isAdmin: user.isAdmin },
    expiresIn: 3600
  });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) return res.status(400).json({ error: 'Email inválido' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'Contraseña muy corta' });

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email ya registrado' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, isAdmin: false });

  res.status(201).json({ id: user.id, email: user.email });
};
