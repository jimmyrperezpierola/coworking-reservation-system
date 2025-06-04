// migrations/20250530142000-create-reservations.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Crear tabla sin FKs iniciales
    await queryInterface.createTable('Reservations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      space_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      total_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 2. Eliminar restricciones existentes si existen
    const constraints = [
      'Reservations_user_id_fkey',
      'Reservations_space_id_fkey'
    ];
    
    for (const constraint of constraints) {
      try {
        await queryInterface.removeConstraint('Reservations', constraint);
        console.log(`Restricción ${constraint} eliminada`);
      } catch (e) {
        console.log(`Restricción ${constraint} no existía`);
      }
    }

    // 3. Agregar nuevas restricciones
    try {
      await queryInterface.addConstraint('Reservations', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'Reservations_user_id_fkey',
        references: {
          table: 'Users',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      console.log('FK user_id agregada');
    } catch (e) {
      console.error('Error agregando FK user_id:', e.message);
    }

    try {
      await queryInterface.addConstraint('Reservations', {
        fields: ['space_id'],
        type: 'foreign key',
        name: 'Reservations_space_id_fkey',
        references: {
          table: 'Spaces',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      console.log('FK space_id agregada');
    } catch (e) {
      console.error('Error agregando FK space_id:', e.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // 1. Eliminar restricciones
    const constraints = [
      'Reservations_user_id_fkey',
      'Reservations_space_id_fkey'
    ];
    
    for (const constraint of constraints) {
      try {
        await queryInterface.removeConstraint('Reservations', constraint);
      } catch (e) {
        console.log(`No se pudo eliminar ${constraint}:`, e.message);
      }
    }
    
    // 2. Eliminar tabla
    await queryInterface.dropTable('Reservations');
  }
};