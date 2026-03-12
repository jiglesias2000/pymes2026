const { Sequelize } = require('sequelize');

// Configuración de la base de datos SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './.data/pymes.db', // Nombre del archivo de la base de datos
  define: {
    // Opciones globales de los modelos
    freezeTableName: true,  // no pluraliza los nombres de las tablas, modelo = tabla
    timestamps: false,  // no crea campos de fecha de creación y modificación


  },
});

module.exports = sequelize;
