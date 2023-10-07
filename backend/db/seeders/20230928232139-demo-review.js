'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Review.bulkCreate([
    {
      userId: 1,
      spotId: 2,
      review: "Just a normal suburban home with all good amenities!",
      stars: 3,
    },
    {
      userId: 2,
      spotId: 3,
      review: "Felt like I going to be murdered.",
      stars: 1,
    },
    {
      userId: 3,
      spotId: 1,
      review: "Beautiful terrace with a refreshing overlook of the city!",
      stars: 5,
    },
    {
      userId: 3,
      spotId: 3,
      review: "My ghost hunting skill from Phasmophobia will come into play",
      stars: 4,
    },
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {[Op.in]: [1, 2, 3]}
    }, {});
  }
};
