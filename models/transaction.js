'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User)
      Transaction.hasMany(models.Cart)
      Transaction.belongsToMany(models.Item, {through: models.Cart})
    }

    get priceToCurency() {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(this.totalPrice)
    }
  }
  Transaction.init({
    totalPrice: DataTypes.INTEGER,
    isCompleted: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  Transaction.beforeCreate(instance => {
    instance.totalPrice = 0
    instance.isCompleted = false
  })

  return Transaction;
};