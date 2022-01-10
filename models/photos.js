'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Photos.init({
    email: DataTypes.STRING,
    img_src: DataTypes.STRING,
    land_date: DataTypes.STRING,
    id_pic: DataTypes.STRING,
    sol_num: DataTypes.STRING,
    camera_take: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Photos',
  });
  return Photos;
};