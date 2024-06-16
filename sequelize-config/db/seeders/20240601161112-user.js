'use strict';
const Sequelize = require('sequelize');
const argon2 = require('argon2')

const {DataTypes} = Sequelize;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [
      {
        uuid: `${DataTypes.UUIDV4}`,
        name: 'admin',
        email: 'admin@gmail.com',
        password: await argon2.hash('admin'),
        role: 'admin',
        image: 'th.jpg',
        url: 'http://localhost:5000/images/users/th.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  }
};
