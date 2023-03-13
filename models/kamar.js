'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.booking_order_detail, {
        foreignKey:`id_kamar`,
        as:`booking_order_detail`
      })

      this.belongsTo(models.tipe_kamar, {
        foreignKey: "id_tipe_kamar",
        as: "tipe_kamar"
      })
    }
  }
  kamar.init({
    id_kamar:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomor_kamar: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'kamar',
    tableName: 'kamar'
  });
  return kamar;
};