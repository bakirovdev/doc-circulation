'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      const options = {
        through: 'user_rules',
        as: 'rules',
        foreignKey: 'user_id',
        otherKey: 'rule_id',
      };
      this.belongsToMany(models.Rule, options);
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull:false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    img: {
      type: DataTypes.STRING,
      allowNull:true
    },
    password: DataTypes.STRING,
    active: {
      type: Boolean,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName:'users'
  });
  return User;
};