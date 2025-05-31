// backend/sequelize-init.js
const { Sequelize } = require('sequelize');

module.exports = function createSequelizeInstance(config) {
  return new Sequelize({
    ...config,
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true
    },
    dialectModule: require('pg'),
    dialectOptions: {
      ...(config.dialectOptions || {}),
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  });
};