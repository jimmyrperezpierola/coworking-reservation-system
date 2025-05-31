const sequelize = require('./src/db');

// Configuración global antes de las pruebas
beforeAll(async () => {
  // Verificar que estamos en entorno de pruebas
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Las pruebas deben ejecutarse en entorno test!');
  }
  
  // Sincronizar y limpiar base de datos
  await sequelize.sync({ force: true });
});

// Limpieza después de todas las pruebas
afterAll(async () => {
  await sequelize.close();
});