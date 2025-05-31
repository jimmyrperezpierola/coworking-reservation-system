require('dotenv').config({ path: '.env.test' });

console.log("=== VARIABLES EN SCRIPT ===");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PORT:", process.env.DB_PORT);

const { Sequelize } = require('sequelize');

// Configuración final con dialecto explícito
const finalConfig = {
  database: process.env.DB_NAME || 'test_db',
  username: process.env.DB_USER || 'test_user',
  password: process.env.DB_PASS || 'test_password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  dialect: 'postgres', // ¡ESTO ES LO QUE FALTA!
  logging: console.log // Para ver las consultas SQL
};

console.log("=== CONFIGURACIÓN FINAL ===");
console.log("Usuario:", finalConfig.username);
console.log("Puerto:", finalConfig.port);
console.log("Dialect:", finalConfig.dialect); // Verificar que se muestra

const sequelize = new Sequelize(finalConfig);

// Probar conexión
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL exitosa con Sequelize');
    // Probar una consulta simple
    return sequelize.query("SELECT 1 + 1 AS result");
  })
  .then(([results]) => {
    console.log('✅ Resultado de prueba:', results[0].result);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error de conexión:', error.original || error);
    process.exit(1);
  });