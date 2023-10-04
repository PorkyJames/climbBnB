const express = require('express');
const Sequelize = require('sequelize');
const { Spot, Image, SpotImage, User, Review } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { handleValidationErrors } = require('../../utils/validation');

// //use to help validate our data
// const validateData = [
//   check('address')
//     .exists({ checkFalsy: true })
//     .withMessage("Street address is required"),
//   check('city')
//     .exists({ checkFalsy: true })
//     .withMessage("City is required"),
//     check('state')
//     .exists({ checkFalsy: true })
//     .withMessage("State is required"),
//     check('country')
//     .exists({ checkFalsy: true })
//     .withMessage("Country is required"),
//     check('lat')
//     .exists({ checkFalsy: true })
//     .isFloat({min:-90,max:90})
//     .withMessage("Latitude is not valid"),
//     check('lng')
//     .exists({ checkFalsy: true })
//     .isFloat({min:-180,max:180})
//     .withMessage("Longitude is not valid"),
//     check('name')
//     .exists({ checkFalsy: true })
//     .isLength({ max: 50 })
//     .withMessage("Name must be less than 50 characters"),
//     check('description')
//     .exists({ checkFalsy: true })
//     .withMessage("Description is required"),
//     check('price')
//     .exists({ checkFalsy: true })
//     .withMessage("Price per day is required"),
//   handleValidationErrors
// ];

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
  const spot = await Spot.findByPk(req.params.spotId);

  //! If our spot doesn't exist
  if (!spot) {
    res.status(404).json({
      message: "Spot couldn't be found"
    })
  }

  res.json(spot)

});

//! POST 

// Create a Spot
router.post("/", requireAuth, async(req,res) => {
  const { user } = req;
  const userId = user.id;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const newSpot = await Spot.create({
    ownerId: userId,
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price,
  });

res.status(201)
   res.json(newSpot);
});

// Add an Image to a Spot based on Spot's Id
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;

  const spot = await Spot.findAll( {
      where: {
          id: req.params.spotId
      }
  })

  //if spot doesn't exist
  if (!spot.length) {
  
      const err = new Error("Spot doesn't exist");
          err.message = "Spot couldn't be found";
          err.status = 404;
          throw err
  }

  //if the user doesn't own the spot
  if (spot[0].dataValues.ownerId !== req.user.id) {
      const err = new Error("Unauthorized");
      err.status = 403;
      err.message = "You must own the spot to add an image"
      throw err
  }

  //if the preview exists within the spot
  if (preview === true) {
      const spotPreviewImageData = await SpotImage.findAll({
          where: {
              spotId: req.params.spotId,
              preview: true
          }
      })

      const spotPreviewImage = spotPreviewImageData[0]
  
      if (spotPreviewImage) {
          await spotPreviewImage.set({
              preview: false
          });
          await spotPreviewImage.save();
      }

      console.log(spotPreviewImage)
      //create the spotImage
      const newSpotImage = await SpotImage.create({
          url: url,
          preview: preview,
          spotId: req.params.spotId
      })
    
      return res.status(200).json({
          id: newSpotImage.id,
          url: newSpotImage.url,
          preview: newSpotImage.preview
      }) 
  }
  
})

//! PUT

// Edit a Spot
router.put('/:spotId', requireAuth, async(req, res) => {
  const userId = req.user.id;
  
  const spot = await Spot.findByPk(req.params.spotId);

  //if spot doesn't exist
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  }
  
  const dvSpot = spot.dataValues;

  //if spot isn't owned by user
  if (userId !== dvSpot.ownerId) {
    return res.status(401).json({
      message: "You must own the spot to make an edit"
    })
  }

  //if user owns the spot / spot exists
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  //set the spot as our new spot and then save it
  await spot.set({
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price,
  })

  await spot.save();

  const finalSpot = await Spot.findByPk(req.params.spotId);

  return res.json(finalSpot)
})

//! DELETE

// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId)

  //if spot doesn't exist
  if (!spot){
    res.status(404).json({ message: "Spot couldn't be found" })
  } 

  const dvSpot = spot.dataValues;

  //if spot isn't owned by user
  if (userId !== dvSpot.ownerId) {
    return res.status(401).json({
      message: "You must own the spot to make an edit"
    })
  }

  await spot.destroy()

  return res.json({ message: 'Successfully deleted' })
})


//! Always need to export the router
module.exports = router;
