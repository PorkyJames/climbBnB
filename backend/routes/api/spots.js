const express = require('express');
const Sequelize = require('sequelize');
const { Spot } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


//! GET
router.get('/current', requireAuth, async (req, res)=> {
    const userId = req.user.id;

    // Get all Spots
    const allSpots = await Spot.findAll()

    //Created spot Object to pull whenever we look for all spots
    //Utilized allSpots.map to transform each spot that we find
    const everySpot = {
        Spots: allSpots.map((spot) => ({
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
          avgRating: spot.avgRating,
          previewImage: spot.previewImage,
        })),
      };

    
    // Get all Spots owned by Current User
    // This will allow us to find within spots anything that belongs to the current user's spots
    const allUserSpots = await Spot.findAll({
        where:{
            owner: userId
        } 
    })

});

// Get details of a Spot from an Id


//! POST 

// Create a Spot

// Add an Image to a Spot based on Spot's Id


//! PUT

// Edit a Spot


//! DELETE

// Delete a Spot

//! Always need to export the router
module.exports = router;
