const { sequelize } = require('./db');
const Space = require('./models/Space');

async function seedSpaces() {
  try {
    await Space.bulkCreate([
      { name: 'Sala Reuniones A', capacity: 8, hourly_rate: 15.50 },
      { name: 'Escritorio Premium', capacity: 1, hourly_rate: 9.75 },
      { name: 'Sala Conferencias B', capacity: 12, hourly_rate: 20.00 }
    ]);
    console.log('✅ Datos de prueba insertados');
  } catch (error) {
    console.error('❌ Error al insertar datos:', error.message);
  } finally {
    await sequelize.close();
  }
}

seedSpaces();
