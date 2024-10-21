'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId'
      });

      Message.belongsTo(models.Room, {
        as: 'room',
        foreignKey: 'roomId'
      })
    }
  }
  Message.init({
    userId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};