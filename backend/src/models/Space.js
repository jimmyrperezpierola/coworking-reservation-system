// backend/src/models/Space.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importa la conexión

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
});

module.exports = Space;