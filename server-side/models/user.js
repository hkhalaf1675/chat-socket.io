'use strict';
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
      User.belongsToMany(models.Room, {
        as: 'rooms',
        through: models.RoomMember,
        foreignKey: 'userId'
      });

      User.hasMany(models.Message, {
        as: 'messages',
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};