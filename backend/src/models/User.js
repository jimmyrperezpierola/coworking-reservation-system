const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Debe ser un correo electrónico válido'
      },
      notEmpty: {
        msg: 'El correo electrónico no puede estar vacío'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    },
    /*set(value) {
      if (value) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hash);
      }
    }*/
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (user) => {
      // Validación adicional antes de crear
      if (!user.email || !user.password) {
        throw new Error('Email y contraseña son requeridos');
      }
    }
  }
});

// Método mejorado para comparar contraseñas
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para obtener datos seguros del usuario (sin password)
User.prototype.getSafeData = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
