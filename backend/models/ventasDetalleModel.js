const { DataTypes } = require('sequelize');
const sequelize = require('./configurarSequelize');

const ventasdetalle = sequelize.define(
  "ventasdetalle",
  {
    IdVentaDetalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    IdVenta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "IdVenta es requerido",
        },
      },
    },
    IdArticulo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "IdArticulo es requerido",
        },
      },
    },
    Cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Cantidad es requerida",
        },
        min: {
          args: [1],
          msg: "Cantidad debe ser mayor a 0",
        },
      },
    },
    Precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Precio es requerido",
        },
      },
    },
  }
);

module.exports = ventasdetalle;
