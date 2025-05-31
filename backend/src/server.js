
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
const app = require('./app');
const sequelize = require('./db');
require('./models/Space');
require('./models/User');
require('./models/Reservation');
require('./models/associations'); // ← relaciones aquí

const startServer = async () => {
  try {
    await sequelize.sync({force: false});
    app.listen(5000, () => {
      console.log('🚀 Servidor iniciado en http://localhost:5000');
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
  }
};

startServer();
