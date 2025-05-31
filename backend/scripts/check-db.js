// check-db.js
const { Client } = require('pg');

const client = new Client({
  user: 'test_user',
  host: 'localhost',
  database: 'postgres', // Nos conectamos a la base por defecto
  password: 'test_password',
  port: 5433,
});

client.connect()
  .then(() => {
    return client.query("SELECT 1 FROM pg_database WHERE datname='test_db'");
  })
  .then(res => {
    if (res.rowCount > 0) {
      console.log('✅ La base de datos "test_db" existe.');
    } else {
      console.log('❌ La base de datos "test_db" NO existe.');
    }
  })
  .catch(err => {
    console.error('❌ Error al conectar:', err.message);
  })
  .finally(() => {
    client.end();
  });
