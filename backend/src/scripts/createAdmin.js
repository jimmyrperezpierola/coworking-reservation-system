// scripts/createAdmin.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const sequelize = require('../db');

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('Admin123*', 10);
    
    await User.create({
      email: 'admin@coworking.com',
      password: hashedPassword, // ¡Asegúrate de hashear!
      isAdmin: true
    });

    console.log('✅ Usuario admin creado');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecuta sin cerrar la conexión automáticamente
createAdmin();