'use strict';
const bcrypt = require('bcrypt')
const faker = require('faker');

module.exports =  {
  up: async (queryInterface, Sequelize) => {
    let data = [];
    let amount = 1;

    while (amount--) {
      let date = new Date();
      data.push({
        username: 'bakirov',
        full_name: 'Umarjon Bakirov',
        active: true,
        password: await bcrypt.hash('1970', await bcrypt.genSalt(10)),
        createdAt:date,
        updatedAt:date,
      })
    }

    return queryInterface.bulkInsert('users', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', null, {});
  }
};
