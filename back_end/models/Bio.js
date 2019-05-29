const Sequelize = require("sequelize");
const sqlDB = require("./sqlDB");

//data type for table of this model
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

class Bio extends Model {}
Bio.init(
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
    modelName: "bio"
  }
);

module.exports = Bio;

sqlDB.sync();
