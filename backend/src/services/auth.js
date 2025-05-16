const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Configuración de tokens
const SECRET_KEY = process.env.JWT_SECRET || 'tu_secreto_secreto';
const TOKEN_EXPIRATION = '1h';

const authService = {
  /**
   * Autentica un usuario y genera token
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<string>} Token JWT
   */
  login: async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Usuario no encontrado');
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Contraseña incorrecta');
    
    return authService.generateToken(user);
  },

  /**
   * Verifica un token JWT
   * @param {string} token 
   * @returns {object} Datos decodificados del token
   */
  verifyToken: (token) => {
    return jwt.verify(token, SECRET_KEY);
  },

  /**
   * Genera un token JWT para un usuario
   * @param {User} user Instancia del modelo User
   * @returns {string} Token JWT
   */
  generateToken: (user) => {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        isAdmin: user.isAdmin 
      },
      SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION }
    );
  },

  /**
   * Hashea una contraseña
   * @param {string} password 
   * @returns {Promise<string>} Contraseña hasheada
   */
  hashPassword: async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
};

module.exports = authService;