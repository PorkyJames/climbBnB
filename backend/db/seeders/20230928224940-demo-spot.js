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
        city: 'OneCity',
        state: 'OneState',
        country: 'OneCountry',
        lat: 50.05,
        lng: 150.05,
        name: "Street Home",
        description: "Simplistic home with all necessary amenities.",
        price: 250,
      },
      {
        ownerId: 2,
        address: '22 City Ave.',
        city: 'TwoCity',
        state: 'TwoState',
        country: 'TwoCountry',
        lat: 55.05,
        lng: 194,
        name: "City Skyscraper with Terrace",
        description: "Apartment with a luxurious view of the city available from the secure Terrace",
        price: 450,
      },
      {
        ownerId: 3,
        address: '33 Rural Blvd.',
        city: 'ThreeCity',
        state: 'ThreeState',
        country: 'ThreeCountry',
        lat: 83.56,
        lng: 56.42,
        name: "Beautiful and Quiet Barn House",
        description: "Quiet and rural location. Perfect location for a horror film.",
        price: 23,
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
