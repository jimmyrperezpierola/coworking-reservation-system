// backend/src/models/Space.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // ✅ Esta es la instancia correcta

const Space = sequelize.define('Space', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Indica si la sala está habilitada o no'
  },
  room_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'sala',
    validate: {
      isIn: [['sala', 'escritorio']]
    },
    comment: 'Tipo de espacio: sala o escritorio'
  }
});

module.exports = Space;
