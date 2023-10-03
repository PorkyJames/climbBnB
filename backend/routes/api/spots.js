const express = require('express');
const Sequelize = require('sequelize');
const { Spot } = require('../../db/models')
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


//! POST 

// Create a Spot

// Add an Image to a Spot based on Spot's Id


//! PUT

// Edit a Spot


//! DELETE

// Delete a Spot



//! Always need to export the router
module.exports = router;
