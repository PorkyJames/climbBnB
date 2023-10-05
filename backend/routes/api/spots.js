const express = require('express');
const Sequelize = require('sequelize');
const { Spot, Image, SpotImage, User, Review, ReviewImage } = require('../../db/models')
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

//GET all reviews based on SpotId
router.get('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  //if spot doesnt exist
  if (!spot) {
      return res.status(404).json({
          message: "Spot couldn't be found"
      })
  }

  //find all reviews based on spotId
  const reviewsData = await Review.findAll({
      where: {
          spotId: req.params.spotId
      }
  })

  const reviewsRes = {
      Reviews: []
  };

  for (let i = 0; i < reviewsData.length; i++) {
      const review = reviewsData[i].dataValues;
      const userData = await User.findAll({
          where: {
              id: review.userId
          },
          attributes: {
              include: ['id', 'firstName', 'lastName'],
              exclude: ['username', 'hashedPassword', 'createdAt', 'updatedAt']
          }
      });
      const user = userData[0].dataValues
      const reviewImages = await ReviewImage.findAll({
          where: {
              reviewId: review.id,
          },
          attributes: {
              include: ['id', 'url'],
              exclude: ['reviewId', 'createdAt', 'updatedAt']
          }
      });

      const reviewObj = {
          id: review.id,
          userId: review.userId,
          review: review.review,
          stars: review.stars,
          User: {
              ...user
          },
          ReviewImages: []
      };

      for (let i = 0; i < reviewImages.length; i++) {
          const reviewData = reviewImages[i].dataValues;
          const reviewImage = {...reviewData};
          reviewObj.ReviewImages.push(reviewImage);
      }

      reviewsRes.Reviews.push(reviewObj)
  };

  return res.status(200).json(reviewsRes)

})

//CREATE a review for a Spot based on SpotID
router.post('/:spotId/reviews', async (req, res) => {
  const userId = req.user.id;

  //if the spot doesn't exist
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  };

  //if the user has a review for the spot already
  const existingReview = await Review.findOne({
    where: {
      userId: req.user.id,
      spotId: req.params.spotId,
    }
  })

  if (existingReview) {
    return res.status(500).json({
      message: "User already has a review for this spot",
    });
  }

  //if no existing review / spot exists, create a new review
  const newReview = await Review.create({
    userId: req.user.id,
    spotId: req.params.id,
    review,
    stars,
  });

  //return our new review
  res.status(200).json({
    id: review.id,
    userId,
    spotId,
    review,
    stars,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  })

})


//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

  const user = req.user;
  const currSpot = await Spot.findByPk(req.params.spotId);

  //if the spot doesn't exist
  if (!currSpot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  }

  const bookingObj = {
    Bookings: []
  }

  //if you are the owner (if you are not the owner would take additional code / time)
  if (user.id === spot.ownerId) {
    const allBookings = await Booking.findAll({
      where: {
        spotId: spot.id
      }
    })
  }

  //iterate through our bookings 
  for (let i = 0; i < allBookings.length; i++) {
    const dvBookings = allBookings[i].dataValues
    let user = await User.findAll({
      where: {
        id: dvBookings.userId
      },
      attributes: {
        include: ['id', 'firstName', 'lastName'],
        exclude: ['email', 'username', 'hashedPassword', 'createdAt', 'updatedAt']
      }
    });

    user = user[0].dataValues

            const bookingObject = {
                User: user,
                ...dvBookings
            }

            bookingObj.Bookings.push(bookingObject);
  }
})


//CREATE a booking for a spot based on Spot ID

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const user = req.user;

  //check if spot exists
  if (!spot) {
      return res.status(404).json({
          message: "Spot couldn't be found"
      })
  }
  
  //check if current user owns the spot
  if (user.id === spot.ownerId) {
      return res.status(403).json({
          message: "You cannot book a booking for your own spot"
      })
  };


  const { startDate, endDate } = req.body;

  const validationError = {
      message: "Bad Request",
      errors: {}
  }

  if (!startDate) {
      validationError.errors.startDate = "Please enter a valid start date"
  }

  if (!endDate) {
      validationError.errors.endDate = "Please enter a valid end date"
  }

  if (validationError.errors.startDate || validationError.errors.endDate) {
      return res.status(400).json(validationError)
  }

  const bookingStartDate = new Date(startDate);
  const bookingEndDate = new Date(endDate);

  //error message to be sent
  const dateError = {
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {}
  };

  //check for overlap
  let Op = Sequelize.Op
  //if start date is invalid
  const currentBookingsStartDate = await Booking.findAll({
      where: {
          spotId: spot.id,
          startDate: {
              [Op.lte]: bookingStartDate
          },
          endDate: 
          {
              [Op.gte]: bookingStartDate
          }
      }
  })

  // console.log(currentBookingsStartDate, '!!!currentBookignsStartDate')

  if (currentBookingsStartDate.length) {
      dateError.errors.startDate = "Start date conflicts with an existing booking"
  }

  const currentBookingsEndDate = await Booking.findAll({
      where: {
          spotId: spot.id,
          startDate: {
              [Op.lte]: bookingEndDate
          },
          endDate: 
          {
              [Op.gte]: bookingEndDate
          }
      }
  })

  if (currentBookingsEndDate.length) {
      dateError.errors.endDate = "End date conflicts with an exisiting booking"
  }

  const currentBookingsBothDates = await Booking.findAll({
      where: {
          spotId: spot.id,
          startDate: {
              [Op.gte]: bookingStartDate
                  },
          endDate: {
              [Op.lte]: bookingEndDate
                  }
          }
      })
  

  if (currentBookingsBothDates.length) {
      dateError.errors.startDate = "Start date conflicts with an existing booking";
      dateError.errors.endDate = "End date conflics wtih an existing booking"
  }

  if (dateError.errors.startDate || dateError.errors.endDate) {
      return res.status(403).json(dateError)
  }

  const newBooking = await Booking.create({
      spotId: spot.id,
      userId: user.id,
      startDate: startDate,
      endDate: endDate
  });

  return res.status(200).json(newBooking)



})


//! Always need to export the router
module.exports = router;
