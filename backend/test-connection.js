const { Client } = require('pg');

// Configuración directa - reemplaza con tus valores
const config = {
  user: 'coworking_user',
  host: 'localhost',
  database: 'coworking',
  password: 'password123',
  port: 5432,
};

const client = new Client(config);

client.connect()
  .then(() => {
    console.log('✅ ¡Conexión exitosa con pg.Client!');
    return client.query('SELECT current_database()');
  })
  .then(res => {
    console.log(`✅ Base de datos actual: ${res.rows[0].current_database}`);
    return client.query('SELECT version()');
  })
  .then(res => {
    console.log(`✅ Versión de PostgreSQL: ${res.rows[0].version}`);
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    console.log('\n🔍 Diagnóstico:');
    console.log('1. ¿PostgreSQL está corriendo? (servicio iniciado)');
    console.log('2. ¿El puerto 5432 está abierto? (netstat -an | find "5432")');
    console.log('3. ¿Existe la base de datos? (psql -U postgres -c "\\l")');
    console.log('4. ¿El usuario tiene permisos? (psql -U postgres -c "\\du")');
  })
  .finally(() => client.end());