const { DataTypes } = require('sequelize');
const sequelize = require('./configurarSequelize');
const bcrypt = require('bcryptjs');

const usuarios = sequelize.define('usuarios', {
  IdUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Clave: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Rol: {
    type: DataTypes.STRING,
    allowNull: false
  }

});

// Hashear la clave automáticamente antes de crear un usuario
usuarios.beforeCreate(async (user) => {
  user.Clave = await bcrypt.hash(user.Clave, 10);
});


module.exports = usuarios;
