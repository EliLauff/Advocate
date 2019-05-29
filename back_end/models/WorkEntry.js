const Sequelize = require("sequelize");
const sqlDB = require("./sqlDB");

//data type for table of this model
const Model = Sequelize.Model;

class WorkEntry extends Model {}
WorkEntry.init(
  {
    bio_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    company_name: {
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
    position_title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    work_description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    skills_learned: {
      type: Sequelize.STRING,
      allowNull: true
    },
    reference_contact_info: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    sequelize: sqlDB,
    modelName: "workEntry"
  }
);

module.exports = WorkEntry;

sqlDB.sync();
