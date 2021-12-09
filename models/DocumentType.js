'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentType extends Model {
   
    static associate(models) {
      // define association here
    }
  };
  DocumentType.init({
    title: {
      type: DataTypes.STRING,
      unique:true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue:true
    }
  }, {
    sequelize,
    modelName: 'DocumentType',
    tableName:'document_types'
  });
  return DocumentType;
};