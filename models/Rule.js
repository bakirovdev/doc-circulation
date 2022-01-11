'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Rule.init({
    title: {
      type: DataTypes.STRING,
      unique:true,
    },
    code: {
      type: DataTypes.STRING,
      unique:true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue:true
    }
  }, {
    sequelize,
    modelName: 'Rule',
    tableName: 'rules',
  });
  return Rule;
};