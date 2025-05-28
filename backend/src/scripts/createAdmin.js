const { User } = require('../models');
const bcrypt = require('bcrypt');
const sequelize = require('../db');

async function createAdmin() {
  try {
    // Reintenta conexión hasta que PostgreSQL esté listo
    let retries = 5;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log('🔗 Conexión establecida con la base de datos.');
        break;
      } catch (err) {
        console.log('⏳ Esperando a que PostgreSQL arranque...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
        retries--;
      }
    }

    if (retries === 0) {
      console.error('❌ No se pudo conectar a la base de datos.');
      process.exit(1);
    }

    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@coworking.com' },
      defaults: {
        password: await bcrypt.hash('Admin123*', 10),
        isAdmin: true
      }
    });

    if (!created) {
      console.log('✅ El usuario admin ya existe.');
    } else {
      console.log('✅ Usuario admin creado exitosamente.');
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Error al crear el usuario:', error.message);
    process.exit(1);
  }
}

createAdmin();
