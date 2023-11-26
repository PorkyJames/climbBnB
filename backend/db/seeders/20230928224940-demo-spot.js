'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
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
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '11 Town St.',
        city: 'Boston',
        state: 'MA',
        country: 'USA',
        lat: 50.05,
        lng: 150.05,
        name: "Large Rock Gym",
        description: "Rock Gym in Boston. 50 years of creative award-winning route setting. Includes both mega cave for belay climbing as well as bouldering. Belay certificate required.",
        price: 100,
      },
      {
        ownerId: 2,
        address: '22 City Ave.',
        city: 'Reno',
        state: 'NV',
        country: 'USA',
        lat: 55.05,
        lng: 162,
        name: "Huge Climbing Gym",
        description: "Beautiful rock climbing gym in Nevada. Ample room for you and 50 other friends to climb in various different areas that our best route setters have set.",
        price: 150,
      },
      {
        ownerId: 3,
        address: '33 London Blvd.',
        city: 'London',
        state: 'England',
        country: 'United Kingdom',
        lat: 83.56,
        lng: 56.42,
        name: "London Climbing Gym",
        description: "Straight in the middle of magnificent London. Plenty of ample parking for avid climbers to go climbing and then explore London. Feel free to also check out our climbing gear store!",
        price: 75,
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {[Op.in]: ['Street Home', 'City Skyscraper with Terrace', 'Beautiful and Quiet Barn House' ] }
    }, {} );
  }
};
