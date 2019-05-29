const Sequelize = require("sequelize");
const sqlDB = require("./sqlDB");

//data type for table of this model
const Model = Sequelize.Model;

class EducationEntry extends Model {}
EducationEntry.init(
  {
    bio_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    school_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    finish_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    degree_type: {
      type: Sequelize.STRING,
      allowNull: true
    },
    degree_major: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    sequelize: sqlDB,
    modelName: "educationEntry"
  }
);

module.exports = EducationEntry;

sqlDB.sync();
