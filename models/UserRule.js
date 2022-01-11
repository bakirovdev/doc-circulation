'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRule extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      this.belongsTo(models.Rule, {
        foreignKey: 'rule_id',
        as: 'rule'
      });
    }
  };
  UserRule.init({
    user_id: DataTypes.INTEGER,
    rule_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserRule',
    tableName: 'user_rules',
  });
  return UserRule;
};