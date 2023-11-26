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
      review: "Great spot in Nevada. Although in the middle of nowhere.",
      stars: 3,
    },
    {
      userId: 2,
      spotId: 3,
      review: "It was incredibly difficult to find parking. Climbs were great though.",
      stars: 2,
    },
    {
      userId: 3,
      spotId: 1,
      review: "Rich with history and some of the best route setting I've seen!",
      stars: 5,
    },
    {
      userId: 3,
      spotId: 3,
      review: "Got to see Big Ben right after climbing! Great food around too, but missing something...",
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
