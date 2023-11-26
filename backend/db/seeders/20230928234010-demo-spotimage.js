'use strict';

const { SpotImage } = require('../models');
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
   await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: 'https://images.squarespace-cdn.com/content/v1/5f4596c47a3e0b7b0ced96b4/1604161618789-MLXBOOHMIGI4BW7RL0MX/unnamed.jpg',
      preview: true,
    },
    {
      spotId: 1,
      url: 'https://images.squarespace-cdn.com/content/v1/52dae429e4b04f03beacb5bc/1478190382880-7JZFEP26XXJ5KPMADFGL/1476449_709739009110127_7257283308281148409_n.jpg',
      preview: true,
    },
    {
      spotId: 1,
      url: 'https://centralrockgym.com/watertown/wp-content/uploads/sites/19/1-2-800x534-640x480.jpg',
      preview: true,
    },
    {
      spotId: 1,
      url: 'https://www.thepadclimbing.org/wp-content/uploads/2023/05/PXL_20230521_163223975.MP_.jpg',
      preview: true,
    },
    {
      spotId: 1,
      url: 'https://s3-media0.fl.yelpcdn.com/bphoto/GpEQ5WC_K_QjI-VObP_b9A/348s.jpg',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://mesarim.com/reno/wp-content/uploads/sites/2/2023/09/RenoHomepage-scaled.jpg',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://www.luxuryrenohomes.com/uploads/renobouldering.jpg',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://travelnevada.com/wp-content/uploads/2021/02/Mesa2-768x432.jpg',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://travelnevada.com/wp-content/uploads/2021/02/Mesa_Desktop.jpg',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://cdn.walltopia.com/wp-content/uploads/20231027223344/training-boards2-scaled.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://citywall.eu/wp-content/uploads/2022/03/IMG_0310-scaled.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://assets-global.website-files.com/60ca0eb72162e830cff668b1/60f274dfe5f61e59e61cdc74_008A3986-2.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://s3.amazonaws.com/images.gearjunkie.com/uploads/2021/04/grasshopper-climbing.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://ugclimbing.com/denver/wp-content/uploads/sites/2/2020/04/April282018_UberGrippen_Candid_slackline_018_DSC9242-768x512.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://www.phillymag.com/wp-content/uploads/sites/3/2021/02/reach-thefactory-featured.jpg',
      preview: true,
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {[Op.in]: [1, 2, 3]}
    }, {});
  }
};
