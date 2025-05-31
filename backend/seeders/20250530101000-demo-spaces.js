'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spaces', [
      {
        name: 'Sala Principal',
        capacity: 4,
        hourly_rate: 15.00,
        enabled: true,
        room_type: 'sala',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Escritorio A',
        capacity: 1,
        hourly_rate: 8.00,
        enabled: true,
        room_type: 'escritorio',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spaces', null, {});
  }
};
