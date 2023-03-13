'use strict';
const {
  Model
} = require('sequelize');
const tipe_kamar = require('./tipe_kamar');
module.exports = (sequelize, DataTypes) => {
  class booking_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.booking_order_detail, {
        foreignKey:`id_booking_order`,
        as:`booking_order_detail`
      })

      this.belongsTo(models.guest, {
        foreignKey:`id_guest`,
        as:`guest`
      })

      this.belongsTo(models.tipe_kamar, {
        foreignKey:`id_tipe_kamar`,
        as:`tipe_kamar`
      })
    }
  }
  booking_order.init({
    id_booking_order:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bo_number: DataTypes.INTEGER,
    id_guest: DataTypes.INTEGER,
    bo_date: DataTypes.DATE,
    checkIn_date: DataTypes.DATE,
    checkOut_date: DataTypes.DATE,
    rooms_amount: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.INTEGER,
    bo_status: DataTypes.ENUM('new','check_in','check_out')
  }, {
    sequelize,
    modelName: 'booking_order',
    tableName: 'booking_order'
  });
  return booking_order;
};