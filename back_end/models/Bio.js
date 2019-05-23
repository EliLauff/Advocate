const Sequelize = require("sequelize");
const sqlDB = require("./sqlDB");

//data type for table of this model
const Model = Sequelize.Model;

class Bio extends Model {}
Bio.init(
  {
    user_id: {
      type: Sequelize.INTEGER,
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
