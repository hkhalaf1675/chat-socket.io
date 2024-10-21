'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.belongsToMany(models.User, {
        as: 'users',
        through: models.RoomMember,
        foreignKey: 'roomId'
      });

      Room.hasMany(models.Message, {
        as: 'messages',
        foreignKey: 'roomId'
      });
    }
  }
  Room.init({
    chatId: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};