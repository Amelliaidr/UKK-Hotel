'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipe_kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.kamar, {
        foreignKey:`id_tipe_kamar`,
        as:`kamar`
      })
      this.hasMany(models.booking_order, {
        foreignKey:`id_tipe_kamar`,
        as:`booking_order`
      })
    }
  }
  tipe_kamar.init({
    id_tipe_kamar:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_tipe_kamar: DataTypes.STRING,
    harga: DataTypes.DOUBLE,
    deskripsi: DataTypes.STRING,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tipe_kamar',
    tableName: 'tipe_kamar'
  });
  return tipe_kamar;
};