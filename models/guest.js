'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class guest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.booking_order, {
        foreignKey:`id_guest`,
        as:`booking_order`
      })
    }
  }
  guest.init({
    id_guest:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    guest_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'guest',
    tableName: 'guest'
  });
  return guest;
};