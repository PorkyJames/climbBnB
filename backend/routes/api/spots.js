const express = require('express');
const Sequelize = require('sequelize');
const { Spot, SpotImage, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => { 
      const spots = await Spot.findAll();
      res.json({ Spots: spots });
  });

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
      const userId = req.user.id; 
      const spots = await Spot.findAll({ 
        where: { ownerId: userId } 
      });
      res.json({ Spots: spots });
  });

// Get details of a Spot from an Id
router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;
      const spot = await Spot.findByPk(spotId, {
        include: [
          {
            model: SpotImage,
            as: 'SpotImages',
          },
          {
            model: User,
            as: 'Owner',
          },
        ],
      });

      if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
      }

      res.json(spot);
  });


//! POST 

// Create a Spot

// Validate the request body
const validateSpotBody = async (req) => {
  const errors = [];

  if (!req.body.address) {
    errors.push('Street address is required');
  }

  if (!req.body.city) {
    errors.push('City is required');
  }

  if (!req.body.state) {
    errors.push('State is required');
  }

  if (!req.body.country) {
    errors.push('Country is required');
  }

  if (!req.body.lat) {
    errors.push('Latitude is not valid');
  }

  if (!req.body.lng) {
    errors.push('Longitude is not valid');
  }

  if (req.body.name.length > 50) {
    errors.push('Name must be less than 50 characters');
  }

  if (!req.body.description) {
    errors.push('Description is required');
  }

  if (!req.body.price) {
    errors.push('Price per day is required');
  }

  return errors;
};

// Create a new spot
router.post('/', async (req, res) => {
  // Use our validateSpotBody
  const errors = await validateSpotBody(req);

  // If there are any validation errors, return a 400 Bad Request response
  if (errors.length > 0) {
    res.status(400).json({
      message: 'Bad Request',
      errors,
    });
    return;
  }

  // Create a new spot object
  const spot = await sequelize.models.Spot.create(req.body);

  // Return a 201 Created response with the new spot object
  res.status(201).json({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  });
});

// Add an Image to a Spot based on Spot's Id


//! PUT

// Edit a Spot
router.put('/:spotid', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot){
    return res.status(404).json({message: "Spot not found"})
  }
  
})


//! DELETE

// Delete a Spot


//! Always need to export the router
module.exports = router;
