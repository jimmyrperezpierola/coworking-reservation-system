// scripts/raw-connection.js
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5433,
  user: 'test_user',
  password: 'test_password',
  database: 'test_db',
  ssl: false
});

client.connect()
  .then(() => {
    console.log('Conexión directa exitosa!');
    client.end();
  })
  .catch(err => {
    console.error('Error en conexión directa:', err);
    process.exit(1);
  });