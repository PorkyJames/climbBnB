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
  const spot = await Sequelize.models.Spot.create(req.body);

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
router.put('/:spotId', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
      return res.status(404).json({
          message: "Spot was not found"
      })
  }

  const finalSpot = spot.dataValues;

  if (userId !== finalSpot.ownerId) {
      return res.status(401).json({
          message: "You must own the spot to make an edit"
      })
  }

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  await spot.set({
      address: address,
      city: city,
      state: state,
      country: country,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price
  })

  await spot.save();

  const editedSpot = await Spot.findByPk(req.params.spotId);

  return res.status(200).json(editedSpot)
})



//! DELETE

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
      return res.status(404).json({
          message: "Spot was not found"
      })
  }

  if (userId !== spot.dataValues.ownerId) {
      return res.status(401).json({
          message: "You must own this spot to delete this post"
      })
  }

  await spot.destroy();

  return res.status(200).json({
      message: "Successfully deleted"
  })
})

//Reviews by Spot ID
router.get("/:spotId/reviews", async (req, res, next) => {
  const spotId = Number(req.params.spotId);

  const currSpot = await Spot.findByPk(spotId);
  if (!currSpot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }
  const spotReviews = await Review.findAll({
    where: {
      spotId: spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Image,
        attributes: ["id", "url", "imageableType"],
      },
    ],
  });

  if (!spotReviews.length) {
    return res.json({
      message: "There are currently no reviews for this spot",
    });
  }

  const updatedReviews = spotReviews.map((spotReview) => {
    const {
      dataValues: { Images, ...newReviews },
    } = spotReview;

    const ReviewImages = Images.map((image) => {
      if ((image.imageableType = "Review")) {
        return { id: image.id, url: image.url };
      }
    });

    return { ...newReviews, ReviewImages };
  });

  return res.json({ Reviews: updatedReviews });
});


//! Always need to export the router
module.exports = router;
