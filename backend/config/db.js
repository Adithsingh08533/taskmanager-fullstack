const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || process.env.DB_NAME || 'Taskmanager',
  process.env.MYSQLUSER || process.env.DB_USER || 'root',
  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = { sequelize };
