const Sequelize = require("sequelize");
const sqlDB = require("./sqlDB");

//data type for table of this model
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

class Certification extends Model {}
Certification.init(
  {
    account_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    sequelize: sqlDB,
    modelName: "certification"
  }
);

module.exports = Certification;

sqlDB.sync();
