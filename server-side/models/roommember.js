'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomMember.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId'
      });

      RoomMember.belongsTo(models.Room, {
        as: 'room',
        foreignKey: 'roomId'
      });
    }
  }
  RoomMember.init({
    roomId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RoomMember',
  });
  return RoomMember;
};