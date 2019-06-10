const Sequelize = require("sequelize");

const sqlDB = new Sequelize("advocate_db", 'postgres', null, {
  host: "localhost",
  dialect: "postgres"
});

module.exports = sqlDB;
