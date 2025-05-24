// backend/src/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  database: 'coworking',
  username: 'coworking_user',
  password: 'password123',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = sequelize; // ✅ solo la instancia



