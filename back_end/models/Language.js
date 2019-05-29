const Sequelize = require("sequelize");
const sqlDB = require("./sqlDB");

//data type for table of this model
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

class Language extends Model {}
Language.init(
  {
    account_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    speaking_score: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    writing_score: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize: sqlDB,
    modelName: "language"
  }
);

module.exports = Language;

sqlDB.sync();
