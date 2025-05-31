const { Sequelize } = require('sequelize');
const config = require('../config/config');

// Obtener entorno actual
const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

// Verificar si tenemos configuración
if (!envConfig) {
  throw new Error(`Configuración no encontrada para entorno: ${env}`);
}

console.log(`✅ Configuración cargada para entorno: ${env}`);
console.log(`Base de datos: ${envConfig.database}`);

const sequelize = new Sequelize({
  database: envConfig.database,
  username: envConfig.username,
  password: envConfig.password,
  host: envConfig.host,
  port: envConfig.port,
  dialect: envConfig.dialect,
  logging: envConfig.logging
});

// Solo autenticar en desarrollo (no en pruebas)
if (env === 'development') {
  sequelize.authenticate()
    .then(() => console.log('✅ Conexión a PostgreSQL exitosa'))
    .catch(err => console.error('❌ Error de conexión:', err));
}

module.exports = sequelize;


