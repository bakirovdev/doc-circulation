'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {


    static associate(models) {
      this.hasMany(models.DocumentExchange, {
        foreignKey: 'document_id',
        as: 'exchange'
      });
      this.hasMany(models.DocumentFile, {
        foreignKey: 'document_id',
        as: 'files',
      });
      this.hasOne(models.DocumentExchange, {
        foreignKey: 'document_id',
        as: 'from_user',
      });
      this.belongsTo(models.DocumentType, {
        foreignKey: 'type_id',
        as: 'type'
      });
      // this.belongsTo(models.DocumentType, {
      //   foreignKey: 'type_id',
      //   as: 'type'
      // });

    }
  };
  Document.init({
    description: {
      type: DataTypes.STRING,
    },
    doc_name: {
      type: DataTypes.STRING,
    },
    type_id: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName: 'documents',
    modelName: 'Document',
  });
  return Document;
};