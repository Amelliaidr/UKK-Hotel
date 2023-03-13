'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking_order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.kamar, {
        foreignKey: "id_kamar",
        as: "kamar"
      })

      this.belongsTo(models.booking_order, {
        foreignKey: "id_booking_order",
        as: "booking_order"
      })
    }
  }
  booking_order_detail.init({
    id_bo_detail:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_booking_order: DataTypes.INTEGER,
    id_kamar: DataTypes.INTEGER,
    duration: DataTypes.DATE,
    total_price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'booking_order_detail',
    tableName: 'booking_order_detail'
  });
  return booking_order_detail;
};