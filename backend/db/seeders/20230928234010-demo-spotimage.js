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
      url: 'https://ssl.cdn-redfin.com/photo/398/mbphoto/147/genMid.1643147_1.jpg',
      preview: true,
    },
    {
      spotId: 1,
      url: 'https://images.trvl-media.com/lodging/77000000/76680000/76673500/76673427/f57e277a.jpg?impolicy=resizecrop&rw=500&ra=fit',
      preview: true,
    },
    {
      spotId: 1,
      url: 'https://hips.hearstapps.com/hmg-prod/images/melanie-pounds-mountain-brook-house-tour-bedroom-jpg-1623350346.jpg',
      preview: true,
    },
    {
      spotId: 1,
      url: 'https://www.thespruce.com/thmb/asM4rLR5OHkPWIxmhM77P3xYWbo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/beautiful-bathrooms-ideas-4101846-hero-e436124be1664154b7771e3b0d23676f.jpg',
      preview: true,
    },
    {
      spotId: 1,
      url: 'https://www.thespruce.com/thmb/YQoHr2VZ3O1VgORCiSsNHAOqWbI=/6232x0/filters:no_upscale():max_bytes(150000):strip_icc()/backyard-ideas-to-delight-diyers-4098826-hero-6476eec3d3e54046920ac0b707050821.jpg',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://nypost.com/wp-content/uploads/sites/2/2019/10/191007-cuozzo-terraces.jpg?quality=75&strip=all&w=1024',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://cdna.artstation.com/p/marketplace/presentation_assets/002/715/014/large/file.jpg?1684496212',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://media.architecturaldigest.com/photos/611446c7d9a1fb9d625f8019/master/pass/210524_EJ_central_park_tower_56E_0147_HIGH_RES.jpg',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://static01.nyt.com/images/2014/11/13/garden/20141113-BATHROOM-slide-A45L/20141113-BATHROOM-slide-A45L-superJumbo.jpg',
      preview: true,
    },
    {
      spotId: 2,
      url: 'https://i.pinimg.com/736x/02/94/f5/0294f5ffd8544338746b6c406325a826.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://i.pinimg.com/originals/1b/11/05/1b1105f8843881865801a6a90e89eda8.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://www.barnhouse.lk/wp-content/uploads/2021/03/DSC1137.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://cdn.onekindesign.com/wp-content/uploads/2013/06/Barn-Bedroom-Design-Ideas-01-1-Kindesign.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://www.digsdigs.com/photos/2013/04/a-barn-bathroom-decorated-with-rough-weathered-wood-with-a-large-window-a-wooden-vanity-and-a-free-standing-tub.jpg',
      preview: true,
    },
    {
      spotId: 3,
      url: 'https://poppytalk.com/wp-content/uploads/2021/10/310F52C1-AA97-4CD7-8335-956383F00152.jpeg',
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
