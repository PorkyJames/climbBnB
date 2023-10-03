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
