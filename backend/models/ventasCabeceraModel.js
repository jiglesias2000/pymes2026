const { DataTypes } = require('sequelize');
const sequelize = require('./configurarSequelize');

const ventascabecera = sequelize.define(
  "ventascabecera",
  {
    IdVenta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    IdCliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "IdCliente es requerido",
        },
      },
    },
    Fecha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha es requerida",
        },
      },
    },
    Total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Total es requerido",
        },
      },
      get() {
        const value = this.getDataValue("Total");
        return value === null ? null : parseFloat(value);
      },
    },
  }
);

module.exports = ventascabecera;
