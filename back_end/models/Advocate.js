const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlDB = require("./sqlDB");

//data type for table of this model
const Model = Sequelize.Model;
const DataTypes = Sequelize.DataTypes;

class Advocate extends Model {
  authenticate(rawPassword) {
    return bcrypt.compareSync(rawPassword, this.password_digest);
  }
  //set encrypted password
  set password(value) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(value, salt);
    this.password_digest = hash;
  }
  //get method for jwt token
  get token() {
    return jwt.sign({ id: this.uuid }, "constant_comment");
  }
  toJSON() {
    let jsonObject = { ...this.dataValues, token: this.token };
    delete jsonObject.password_digest;
    return jsonObject;
  }
}
Advocate.init(
  {
    language: {
      type: Sequelize.STRING,
      allowNull: true
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    active_bio_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: {
        args: true,
        msg: "Email address already in use!"
      }
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password_digest: {
      type: Sequelize.STRING
    },
    account_type: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "advocate"
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  },
  {
    sequelize: sqlDB,
    modelName: "advocate"
  }
);

module.exports = Advocate;

sqlDB.sync();
