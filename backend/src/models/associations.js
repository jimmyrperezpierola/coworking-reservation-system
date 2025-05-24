const User = require('./User');
const Space = require('./Space');
const Reservation = require('./Reservation');

// Usuario tiene muchas reservas
User.hasMany(Reservation, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });

// Espacio tiene muchas reservas
Space.hasMany(Reservation, { foreignKey: 'space_id', onDelete: 'CASCADE' });
Reservation.belongsTo(Space, { foreignKey: 'space_id' });

// Si necesitas otros vínculos personalizados, añádelos aquí

module.exports = () => {
  // Simplemente para ejecutar cuando se importe
};
