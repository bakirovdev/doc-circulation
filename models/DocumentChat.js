'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentChat extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  };
  DocumentChat.init({
    description: {
      type: DataTypes.STRING,
    },
    file_url: {
      type: DataTypes.STRING,
    },
    document_id: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    tableName: 'document_chats',
    modelName: 'DocumentChat',
  });
  return DocumentChat;
};