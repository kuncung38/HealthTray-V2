'use strict';
const fs = require('fs');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const data = JSON.parse(fs.readFileSync('./data/userData.json')).map(el => {
                    let salt = bcrypt.genSaltSync(10)
                    let hash = bcrypt.hashSync(el.password, salt)
                    let createdAt = new Date()
                    let updatedAt = new Date()
                    
                    return {
                      email: el.email, 
                      password: hash, 
                      role: el.role,
                      createdAt,
                      updatedAt
                    }
                })

    return queryInterface.bulkInsert('Users', data)
          
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users')
  }
};
