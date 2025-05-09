const { sequelize } = require('../db');
const Space = require('./Space');
const Reservation = require('./Reservation');
const User = require('./User'); 

// Definir relaciones
Space.hasMany(Reservation, { foreignKey: 'space_id' });
Reservation.belongsTo(Space, { foreignKey: 'space_id' });

// Nueva relación: Un User puede tener muchas Reservations
User.hasMany(Reservation, { foreignKey: 'user_id' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });

// Exportar modelos y sequelize
module.exports = {
  sequelize,
  Space,
  Reservation,
  User
};