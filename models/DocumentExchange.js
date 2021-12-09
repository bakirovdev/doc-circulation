'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentExchange extends Model {

    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'from_user_id',
        as: 'from'
      });
      this.belongsTo(models.User, {
        foreignKey: 'to_user_id',
        as: 'to'
      });
    }
  };
  DocumentExchange.init({
    document_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    from_user_id: DataTypes.INTEGER,
    draft: DataTypes.BOOLEAN,
    accept: DataTypes.BOOLEAN,
    status: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'document_exchanges',
    modelName: 'DocumentExchange',
  });
  return DocumentExchange;
};