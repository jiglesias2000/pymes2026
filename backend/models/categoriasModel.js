const { DataTypes } = require('sequelize');
const sequelize = require('./configurarSequelize');

const categorias = sequelize.define('categorias', {
  IdCategoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = categorias;