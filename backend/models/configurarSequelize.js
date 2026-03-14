require('dotenv').config();
const { Sequelize, Op } = require('sequelize');
// Importar pg a nivel módulo para que el bundler de Vercel lo incluya
try { require('pg'); } catch (e) { /* pg no necesario para SQLite */ }

let sequelize;

if (process.env.DB_DIALECT === 'postgres') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    define: {
      freezeTableName: true,
      timestamps: false,
    },
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './.data/pymes.db',
    define: {
      freezeTableName: true,
      timestamps: false,
    },
  });
}

// Helper: Op.iLike para PostgreSQL (case-insensitive), Op.like para SQLite (ya es case-insensitive)
const OpLike = process.env.DB_DIALECT === 'postgres' ? Op.iLike : Op.like;

module.exports = sequelize;
module.exports.OpLike = OpLike;
