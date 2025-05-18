// backend/src/models/Reservation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Reservation = sequelize.define('Reservation', {
  user_id: {  // Reemplazar user_email
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
    model: 'Users',
    key: 'id'
    }
   },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'confirmed'
  },
  space_id: {  // ¡Este campo es esencial!
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Spaces', // Nombre de la tabla relacionada
      key: 'id'
    }
  },
  total_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'confirmed'
  }
});

module.exports = Reservation;