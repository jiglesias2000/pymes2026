const { DataTypes } = require('sequelize');
const sequelize = require('./configurarSequelize');

const clientes = sequelize.define(
  "clientes",
  {
    IdCliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(55),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nombre es requerido",
        },
        len: {
          args: [4, 55],
          msg: "Nombre debe ser tipo caracteres, entre 4 y 55 de longitud",
        },
      },
    },
    Cuit: {
      type: DataTypes.STRING(11),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Cuit es requerido",
        },
        is: {
          args: ["^[0-9]{11}$", "i"],
          msg: "Cuit debe ser numérico de 11 dígitos sin guiones",
        },
      },
    },
    Mail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Mail es requerido",
        },
        isEmail: {
          args: true,
          msg: "Mail debe tener formato de email válido",
        },
      },
    },
    CreditoMaximo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "CreditoMaximo es requerido",
        },
      },
      get() {
        const value = this.getDataValue("CreditoMaximo");
        return value === null ? null : parseFloat(value);
      },
    },
    FechaNacimiento: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha de Nacimiento es requerida",
        },
      },
    },
    FechaIngreso: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Fecha de Ingreso es requerida",
        },
      },
    },
    Localidad: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Localidad es requerida",
        },
        len: {
          args: [5, 50],
          msg: "Localidad debe ser entre 5 y 50 caracteres",
        },
      },
    },
    Calle: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Calle es requerida",
        },
        len: {
          args: [5, 50],
          msg: "Calle debe ser entre 5 y 50 caracteres",
        },
      },
    },
    NumeroCalle: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "NumeroCalle es requerido",
        },
        is: {
          args: ["^[0-9]{1,5}$", "i"],
          msg: "NumeroCalle debe ser numérico de 1 a 5 dígitos",
        },
      },
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Activo es requerido",
        },
      },
    },
  },
  {
    hooks: {
      beforeValidate: function (cliente, options) {
        if (typeof cliente.Nombre === "string") {
          cliente.Nombre = cliente.Nombre.toUpperCase().trim();
        }
      },
    },
  }
);

module.exports = clientes;
