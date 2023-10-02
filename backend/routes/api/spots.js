const express = require('express');
const Sequelize = require('sequelize');
const { Spot, SpotImage, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Get all Spots
router.get('/', requireAuth, async (req, res) => {
    try {
      const spots = await Spot.findAll();
      res.status(200).json({ Spots: spots });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    try {
      const userId = req.user.id; 
      const spots = await Spot.findAll({ where: { ownerId: userId } });
      res.status(200).json({ Spots: spots });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get details of a Spot from an Id
router.get('/:spotId', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    try {
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

        res.status(200).json(spot);
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

//! POST 

// Create a Spot

// Add an Image to a Spot based on Spot's Id


//! PUT

// Edit a Spot


//! DELETE

// Delete a Spot

//! Always need to export the router
module.exports = router;
