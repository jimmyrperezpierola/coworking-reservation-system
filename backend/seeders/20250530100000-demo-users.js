// seeders/20250530100000-demo-users.js
'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 1. Eliminar usuarios existentes primero
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: ['user1@example.com', 'admin@example.com']
      }
    }, {});
    
    // 2. Insertar nuevos usuarios con console.log para verificación
    const users = [
      {
        email: 'user1@example.com',
        password: hashedPassword,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    console.log('Insertando usuarios:', users.map(u => u.email));
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
