'use strict';
const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction)
      User.hasOne(models.Profile)
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail : {
          msg: `Must be correct Email format`
        }
      }
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      validate: {
        notIn: {
          args: [['admin', 'user']],
          msg : `Role must be either admin or user`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(instance => {
    let salt = bcrypt.genSaltSync(10)
    instance.password = bcrypt.hashSync(instance.password, salt)
    instance.role = 'user'
  })
  return User;
};