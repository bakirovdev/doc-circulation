'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DocumentFile.init({
    document_id: {
      type: DataTypes.STRING,
    },
    file_name: {
      type: DataTypes.STRING,
    },
    file_url: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    tableName:'document_files',
    modelName: 'DocumentFile',
  });
  return DocumentFile;
};