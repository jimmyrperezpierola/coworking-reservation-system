const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: 'coworking',
  username: 'coworking_user',
  password: 'password123',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: console.log
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ ¡Conexión exitosa con Sequelize!');
    const [result] = await sequelize.query('SELECT current_database()');
    console.log(`✅ Base de datos: ${result[0].current_database}`);
  } catch (error) {
    console.error('❌ Error de conexión:', error.original.message);
    console.log('Posible solución:');
    console.log(`- Ejecuta: psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE coworking TO coworking_user"`);
  } finally {
    await sequelize.close();
  }
}

testConnection();