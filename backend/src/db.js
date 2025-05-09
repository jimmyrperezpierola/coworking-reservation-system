// backend/src/db.js
const { Sequelize } = require('sequelize');

// Configuración de la conexión (ajusta con tus credenciales)
const sequelize = new Sequelize({
  database: 'coworking',
  username: 'coworking_user',
  password: 'password123', // La que usaste al instalar PostgreSQL
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false, // Para evitar mensajes de SQL en consola
});

// Prueba la conexión al iniciar
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = sequelize;