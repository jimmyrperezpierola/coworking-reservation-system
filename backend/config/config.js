const path = require('path'); // ¡Agregar esta línea!

const env = process.env.NODE_ENV || 'development';
const envFile = env === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(__dirname, `../${envFile}`);

require('dotenv').config({ 
  path: envPath,
  override: true 
});

module.exports = {
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
  },
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    //logging: console.log
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres"
  }
};