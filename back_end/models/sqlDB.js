const Sequelize = require("sequelize");

const sqlDB = new Sequelize("advocate_db", 'postgres', 'admin', {
  host: "localhost",
  dialect: "postgres"
});

module.exports = sqlDB;
