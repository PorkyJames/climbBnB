const express = require('express');
const Sequelize = require('sequelize');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//use to help validate our data
const validateData = [
    check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
    check("city")
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
    check("state")
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
    check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
    check("lat")
    .exists({ checkFalsy: true })
    .isFloat({min:-90,max:90})
    .withMessage("Latitude is not valid"),
    check("lng")
    .exists({ checkFalsy: true })
    .isFloat({min:-180,max:180})
    .withMessage("Longitude is not valid"),
    check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
    check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
    check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),

  handleValidationErrors
];

const validateCreateReview = [
    check("review")
      .exists({ checkFalsy: true })
      .withMessage("Review text is required"),
    check("stars")
      .exists({ checkFalsy: true })
      .isInt({
        min: 1,
        max: 5,
      })
      .withMessage("Stars must be an integer from 1 to 5"),

    handleValidationErrors,
  ];

const validateQueryParams = [
  // page: integer, minimum: 1, maximum: 10, default: 1
  check("page")
    .isInt({
      min: 1,
      max: 10,
    })
    .withMessage("Page must be greater than or equal to 1"),
  // size: integer, minimum: 1, maximum: 20, default: 20
  check("size")
    .isInt({
      min: 1,
      max: 20
    })
    .withMessage("Size must be greater than or equal to 1"),
  // maxLat: decimal, optional
  check("maxLat")
    .isFloat({
      max: 180
    })
    .optional()
    .withMessage("Maximum latitude is invalid"),
  // minLat: decimal, optional
  check("minLat")
    .isFloat({
      min: -180
    })
    .optional()
    .withMessage("Minimum latitude is invalid"),
  // minLng: decimal, optional
  check("minLng")
    .isFloat({
      min: -90
    })
    .optional()
    .withMessage("Maximum longitude is invalid"),
  // maxLng: decimal, optional
  check("maxLng")
    .isFloat({
      max: 90
    })
    .optional()
    .withMessage("Minimum longitude is invalid"),
  // minPrice: decimal, optional, minimum: 0
  check("minPrice")
    .isFloat({
      min: 0,
    })
    .optional()
    .withMessage("Minimum price must be greater than or equal to 0"),
  // maxPrice: decimal, optional, minimum: 0
  check("maxPrice")
    .isFloat({
      min: 0,
    })
    .optional()
    .withMessage("Maximum price must be greater than or equal to 0"),

  handleValidationErrors,
]

// Get all Spots
router.get('/', async (req, res) => {

    // Parse query parameters. We're going to destructure query params from req.query. 
    let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let { page, size } = req.query;

    // Set up the rules by defining a paginated list that we'll get back from our query
    const paginatedQuery = {
      where: {},
      limit: parseInt(size) || 20,
      offset: (parseInt(page) - 1) * (parseInt(size) || 20),
    };

    // Validation and error handling
    const errors = {};

    if (page && (page < 1 || page > 10)) {
      errors.page = "Page must be between 1 and 10";
    }

    if (size && (size < 1 || size > 20)) {
      errors.size = "Size must be between 1 and 20";
    }

    if (minLat && (minLat < -90 || minLat > 90)) {
      errors.minLat = "Invalid minimum latitude";
    }

    if (maxLat && (maxLat < -90 || maxLat > 90)) {
      errors.maxLat = "Invalid maximum latitude";
    }

    if (minLng && (minLng < -180 || minLng > 180)) {
      errors.minLng = "Invalid minimum longitude";
    }

    if (maxLng && (maxLng < -180 || maxLng > 180)) {
      errors.maxLng = "Invalid maximum longitude";
    }

    if (minPrice && minPrice < 0) {
      errors.minPrice = "Minimum price must be greater than or equal to 0";
    }

    if (maxPrice && maxPrice < 0) {
      errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    // Build query conditions based on valid parameters
    if (!isNaN(minLat) && !isNaN(maxLat)) {
      paginatedQuery.where.lat = { [Op.between]: [parseFloat(minLat), parseFloat(maxLat)] };
    }

    if (!isNaN(minLng) && !isNaN(maxLng)) {
      paginatedQuery.where.lng = { [Op.between]: [parseFloat(minLng), parseFloat(maxLng)] };
    }

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      paginatedQuery.where.price = { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] };
    }

    // Retrieve spots based on query options
    const allFilteredSpots = await Spot.findAll(paginatedQuery);

    // Prepare the response
    const paginatedSpotList = {
      Spots: allFilteredSpots,
      page: parseInt(page) || 1,
      size: parseInt(size) || 20,
    };

    res.json(paginatedSpotList);
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

  // If our spot doesn't exist
  if (!spot) {
    res.status(404).json({
      message: "Spot couldn't be found"
    })
  }

  const dvSpot = spot.dataValues;

  //find our adjusted spot's ids
  const adjustedSpotReviews = await Review.findAll({
    where: {
      spotId: spot.dataValues.id
    }
  })

  const numReviews = adjustedSpotReviews.length;

  //we're going to add the total with the adjusted spot reviews
  let sum = 0;
  //iterate and add
  for (let i = 0; i < adjustedSpotReviews.length; i++) {
    sum += adjustedSpotReviews[i].dataValues.stars
  }

  //then we can get the average rating
  const average = sum / adjustedSpotReviews.length;

  //this will be the result of what our res.json will return
  const result = {
    ...dvSpot,
    numReviews,
    average,
    SpotImages: [],
  }
  
  const spotImages = await SpotImage.findAll({
    where: {
      spotId: spot.dataValues.id
    }
  })

  //then we iterate again using for loop and push the imageObj into our result
  for (let i = 0; i < spotImages.length; i++) {
    let currentImage = spotImages[i];
    let imageObj = {
      id: currentImage.id,
      url: currentImage.url,
      preview: currentImage.preview,
    }
    result.SpotImages.push(imageObj)
  }

  
  const owner = await User.findByPk(spot.dataValues.ownerId) 

  const dvOwner = owner.dataValues

  result.Owner = {
    id: dvOwner.id,
    firstName: dvOwner.firstName,
    lastName: dvOwner.lastName,
  }

  return res.json(result)

});

//! POST 

// Create a Spot
router.post("/", requireAuth, async (req,res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const newSpot = await Spot.create( {
    ownerId: user.id,
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

    res.status(201).json(newSpot);
});

// Create an Image to a Spot based on Spot's Id
router.post('/:spotId/images', requireAuth, async (req, res,) => {
    const { url, preview } = req.body;

    //grab our spot via findAll and our spoId
    const spot = await Spot.findAll( {
        where: {
            id: req.params.spotId
        }
    })

    //if the spot doesn't exist
    if (!spot) {
        const error = new Error("Spot doesn't exist");
        error.message = "Spot couldn't be found";
        error.status = 404;
        throw error
    }


    //if they aren't, then unauthorize them
    if (spot[0] && spot[0].dataValues.ownerId !== req.user.id) {
        const error = new Error("Unauthorized");
        error.status = 403;
        error.message = "You must own the spot to add an image"
        throw error;
    }

    //if there is a preview for a spot already
    if (preview === true) {
        const spotPreviewImageData = await SpotImage.findAll({
            where: {
                spotId: req.params.spotId,
                preview: true
            }
        })

        //grab our first preview image
        const spotPreviewImage = spotPreviewImageData[0]
    
        //if the spotPreviewImage exists, then we'll 
        if (spotPreviewImage) {
            await spotPreviewImage.set({
                preview: false
            });
            await spotPreviewImage.save();
        }
    }
    
    //
    const newSpotImage = await SpotImage.create({
        url: url,
        preview: preview,
        spotId: req.params.spotId
    })

    return res.json({
        id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview
    }) 
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
  const userId = req.user.id;
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

  //if spot doesn't exist
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

  return res.json(reviewsRes)

})

//!CREATE a review for a Spot based on SpotID
router.post('/:spotId/reviews', requireAuth, validateCreateReview, async (req, res) => {
  //check for spot
  const spot = await Spot.findByPk(req.params.spotId) 

  if (!spot) {
      return res.status(404).json({
          message: "Spot couldn't be found"
      })
  }

  const refinedSpot = spot.dataValues
  const user = req.user
  //check to see if there is a review by that user for that spot

  const userReviewsForSpot = await Review.findAll({
      where: {
          spotId: refinedSpot.id,
          userId: user.id
      }
  })

  if (userReviewsForSpot.length) {
      return res.status(500).json({
          message: "User already has a review for this spot"
      })
  }


  const { review, stars } = req.body

  const newReview = await Review.create({
      userId: user.id,
      spotId: req.params.spotId,
      review: review,
      stars: stars
  })

  return res.status(201).json(newReview);
})


//!Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  
  //create our booking result obj that we'll push into later
  const result = {
      Bookings: []
  }
  //grab the current user
  const user = req.user;
  //get details of the spot via our spotId
  const spot = await Spot.findByPk(req.params.spotId);

  //if the spot doesn't exist
  if (!spot) {
      return res.status(404).json({
          message: "Spot couldn't be found"
      })
  }

  //if the current user IS the owner
  if (user.id === spot.ownerId) {
      const bookings = await Booking.findAll({
          where: {
              spotId:  spot.id
          }
      })

      //iterate through our bookings and get the details then find where it's
      //designated by userId. Then we include / exclude whatever we want
      for (let i = 0; i < bookings.length; i++) {
          const booking = bookings[i].dataValues;
          let user = await User.findAll({
              where: {
                  id: booking.userId
              },
              attributes: {
                  include: ['id', 'firstName', 'lastName'],
                  exclude: ['email', 'username', 'hashedPassword', 'createdAt', 'updatedAt']
              }
          });

          //grab the first item in our user array and give us more
          //details via the dataValues
          user = user[0].dataValues

          const bookingObj = {
              User: user,
              ...booking
          }

          result.Bookings.push(bookingObj);
      }

  } else {

      //if the current user is NOT the owner

      //grab each booking based on the spot's id
      const bookings = await Booking.findAll({
          where: {
              spotId:  spot.id
          }
      })

      //iterate through our bookings and grab each info for
      //the item inside of our bookings via datavalues
      for (let i = 0; i < bookings.length; i++) {
          const booking = bookings[i].dataValues;

          //create a new bookings Object that will change the info
          //for each booking spotId, startDate, and endDate
          const bookingsObj = {
              spotId: booking.spotId,
              startDate: booking.startDate,
              endDate: booking.endDate
          }

          //then push all of that nonsense into our results bookings obj
          result.Bookings.push(bookingsObj)
      }

  }

  return res.json(result)
})

//!CREATE a booking for a spot based on Spot ID

router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const user = req.user;

  //if the spot doesn't exist
  if (!spot) {
      return res.status(404).json({
          message: "Spot couldn't be found"
      })
  }
  
  //if the user doesn't own the spot
  if (user.id === spot.ownerId) {
      return res.status(403).json({
          message: "You cannot book a booking for your own spot"
      })
  };

  const { startDate, endDate } = req.body;

  //create our validation errors for any bad requests. Similar to what we've done before

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

  const dateError = {
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {}
  };

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

  if (currentBookingsStartDate.length) {
      dateError.errors.startDate = "Start date conflicts with an existing booking"
  }

  //if there is a conflict with the end date as well
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
      dateError.errors.endDate = "End date conflicts with an existing booking"
  }

  if (dateError.errors.startDate || dateError.errors.endDate) {
      return res.status(403).json(dateError)
  }

  //if everything checks out fine, create a new booking with all of the relevant information. 
  const newBooking = await Booking.create({
      spotId: spot.id,
      userId: user.id,
      startDate: startDate,
      endDate: endDate
  });

  return res.json(newBooking)

})

//! Always need to export the router
module.exports = router;
