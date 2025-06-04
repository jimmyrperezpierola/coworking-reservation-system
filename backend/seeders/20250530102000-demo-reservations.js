'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE email IN (:emails) ORDER BY email ASC`,
      {
        replacements: { emails: ['user1@example.com', 'admin@example.com'] },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    const spaces = await queryInterface.sequelize.query(
      `SELECT id FROM "Spaces" WHERE name IN (:names) ORDER BY name ASC`,
      {
        replacements: { names: ['Sala Principal', 'Escritorio A'] },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    await queryInterface.bulkInsert('Reservations', [
      {
        user_id: users[0].id,
        space_id: spaces[0].id,
        start_time: new Date('2025-06-01T10:00:00'),
        end_time: new Date('2025-06-01T12:00:00'),
        total_cost: 30.00,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: users[1].id,
        space_id: spaces[1].id,
        start_time: new Date('2025-06-02T14:00:00'),
        end_time: new Date('2025-06-02T15:30:00'),
        total_cost: 12.00,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reservations', null, {});
  }
};
