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
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
  .exists({ checkFalsy: true })
  .withMessage("Country is required"),
  check("lat")
  .exists({ checkFalsy: true })
  .isFloat({
    min: -90,
    max: 90,
  })
  .withMessage("Latitude is not valid"),
  check("lng")
  .exists({ checkFalsy: true })
  .isFloat({
    min: -180,
    max: 180,
  })
  .withMessage("Longitude is not valid"),
  check("name")
  .exists({ checkFalsy: true })
  .isLength({
    max: 50,
  })
  .withMessage("Name must be less than 50 characters"),
  check("description")
  .exists({ checkFalsy: true })
  .withMessage("Description is required"),
  check("price")
  .exists({ checkFalsy: true })
  .isFloat({
    min: 0,
  })
  .withMessage("Price per day is required"),

handleValidationErrors,
];

//used to help validate our booking
const validateBooking = [
    check("startDate")
      .exists({ checkFalsy: true })
      .isISO8601()
      .withMessage("Enter a valid start date YYYY-MM-DD"),
    check("endDate")
      .exists({ checkFalsy: true })
      .isISO8601()
      .withMessage("Enter a valid end date YYYY-MM-DD"),
    handleValidationErrors,
  ];

//used to help validate our create Review
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

// Get all Spots
router.get('/', async (req, res) => {
  // Validate the query parameters
  let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  
  let query = {
      where: {},
      include: []
  }

  let { page, size } = req.query;

  const error = {
    message: "Bad Request",
    errors: {},
  };

  if (page && page < 1) {
    error.errors.page = "Page must be greater than or equal to 1"
  } 
  if (page && page > 10) {
    error.errors.page = "Page must be less than or equal to 10"
  } 
  if (size && size < 1) {
    error.errors.size = "Size must be greater than or equal to 1"
  } 
  if (size && size > 20) {
    error.errors.size = "Size must be less than or equal to 20"
  } 
  if (maxLat && (maxLat > 90 || maxLat < -90)) {
    error.errors.maxLat = "Maximum latitude is invalid"
  } 
  if (minLat && (minLat < -90 || minLat > 90)) {
    error.errors.minLat = "Minimum latitude is invalid"
  } 
  if (maxLng && (maxLng > 180 || maxLng < -180)) {
    error.errors.maxLng = "Maximum longitude is invalid"
  } 
  if (minLng && (minLng < -180 || minLng > 180)) {
    error.errors.minLng = "Minimum longitude is invalid"
  } 
  if (minPrice && minPrice < 0) {
    error.errors.minPrice = "Minimum price must be greater than or equal to 0"
  } 
  if (maxPrice && maxPrice < 0) {
    error.errors.maxPrice = "Maximum price must be greater than or equal to 0"
  }
  
  // Check if there are any errors
  if (Object.keys(error.errors).length) {
    return res.status(400).json(error);
  }
  
  if (!Number.isNaN(page) && parseInt(page) <= 1) page = 1;
  else if (!Number.isNaN(page) && parseInt(page) >= 10) page = 10;
  else if (!Number.isNaN(page)) page = parseInt(page);
  else page = 1;

  if (!Number.isNaN(size) && parseInt(size) <= 1) size = 1;
  else if (!Number.isNaN(size) && parseInt(size) >= 20) size = 20;
  else if (!Number.isNaN(size)) size = parseInt(size);
  else size = 20;

  if (size >= 1 && page >= 1) {
      query.limit = size;
      query.offset = size * (page - 1)
  }

  //querying

  const Op = Sequelize.Op;

  if (minLat) {
      minLat = parseFloat(minLat)
      query.where.lat = {
          [Op.gte]: minLat
      }
  }

  if (maxLat) {
      maxLat = parseFloat(maxLat);
      query.where.lat = {
          [Op.lte]: maxLat
      }
  }

  if (minLng) {
      minLng = parseFloat(minLng);
      query.where.lng = {
          [Op.gte]: minLng
      }
  }

  if (maxLng) {
      maxLng = parseFloat(maxLng);
      query.where.lng = {
          [Op.lte]: maxLng
      }
  }

  if (minPrice) {
      minPrice = parseFloat(minPrice);
      query.where.price = {
          [Op.gte]: minPrice
      }
  }

  if (maxPrice) {
      maxPrice = parseFloat(maxPrice);
      query.where.price = {
          [Op.lte]: maxPrice
      }
  }

  const allSpots = await Spot.findAll(query);

  let result = {
      Spots: []
  }

  //iterating through each spot to create each spot object
  for (let i = 0; i < allSpots.length; i++) {
      const spot = allSpots[i];
      //getting all reviews associated with each spot
      const reviews = await Review.findAll({
          where: {
              spotId: spot.id
          }
      });

      //calculating average rating for each spot
      let total = 0;

      for (const review of reviews) {
        total += review.dataValues.stars;
      }

      const average = total / reviews.length;

      const spotPreviewImage = await SpotImage.findAll({
          where : {
              spotId: spot.id,
              preview: true
          }
      })

      let urlImage;

      if (spotPreviewImage[0]) {
          urlImage = spotPreviewImage[0].dataValues.url;
      } else urlImage = 'none'

      //creating each spot object
      const spotObj = {
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
          avgStarRating: average,
          previewImage: urlImage
      };

      //adding each spot object to the array of spot objects
      result.Spots.push(spotObj);
  }

  result.page = page;
  result.size = size;

 return res.json(result);
})

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const allUserSpots = await Spot.findAll({
      where: {
          ownerId: userId
      }
  })

  let allUserSpotsRes = {
      Spots: []
  };

  //iterating through each spot to create each spot object
  for (let i = 0; i < allUserSpots.length; i++) {
      const spot = allUserSpots[i];
      //getting all reviews associated with each spot
      const reviews = await Review.findAll({
          where: {
              spotId: spot.id
          }
      });

      //calculating average rating for each spot

      let avgRating;

      if (!reviews.length) avgRating = "No reviews yet";
      else {
          let total = 0;

          reviews.forEach(review => {
              total += review.dataValues.stars
          })
  
          avgRating = total / reviews.length;
      }

      const spotPreviewImage = await SpotImage.findAll({
          where : {
              spotId: spot.id,
              preview: true
          }
      })

      let imageUrl;

      if (spotPreviewImage[0]) {
          imageUrl = spotPreviewImage[0].dataValues.url;
      } else imageUrl = 'none'

      const spotObj = {
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
          avgRating: avgRating,
          previewImage: imageUrl
      };

      allUserSpotsRes.Spots.push(spotObj)
  }

  return res.json(allUserSpotsRes);

})

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
router.post("/", requireAuth, validateData, async (req,res) => {
  let { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;

  lat = Number(lat);
  lng = Number(lng);
  price = Number(price);

  const newSpot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  return res.status(201).json(newSpot);
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

    // if the spot doesn't exist
    if (!spot.length) {
        const error = new Error("Spot doesn't exist");
        error.message = "Spot couldn't be found";
        error.status = 404;
        throw error
    }

    //if they aren't, then unauthorize them
    if (spot[0] && spot[0].dataValues.ownerId !== req.user.id) {
        return res.status(401).json({
            message: "You must own the spot to add an image"
        })
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
router.put('/:spotId', requireAuth, validateData, async(req, res) => {
  const userId = req.user.id;
  
  const spot = await Spot.findByPk(req.params.spotId);

  //if spot doesn't exist
  if (!spot) {
    const err = new Error("Spot doesn't exist");
        err.message = "Spot couldn't be found";
        err.status = 404;
        throw err
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
          ...review,
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

router.post("/:spotId/bookings", requireAuth, validateBooking, async (req, res, next) => {
    let { startDate, endDate } = req.body;
    const { user } = req;
    const spotId = Number(req.params.spotId);
    const currSpot = await Spot.findByPk(spotId);
    if (!currSpot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    if (currSpot.ownerId === user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }

    const bookedDates = await Booking.findAll({
      where: {
        spotId,

        [Op.or]: [
          {
            startDate: {
              [Op.gte]: startDate,
            },
          },
          {
            endDate: { [Op.lte]: endDate },
          },
        ],
      },
    });
    
    for (let booking of bookedDates) {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      //    start      startDate      end      endDate
      if (new Date(startDate) - start >= 0 && end - new Date(startDate) >= 0) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.status = 403;
        err.errors = {
          startDate: "Start date conflicts with an existing booking",
        };
        return next(err);
      }
      //   startDate    start    endDate    end
      if (new Date(endDate) - start >= 0 && end - new Date(endDate) >= 0) {
        const err = new Error(
          "Sorry, this spot is already booked for the specified dates"
        );
        err.status = 403;
        err.errors = {
          endDate: "End date conflicts with an existing booking",
        };
        return next(err);
      }

      // startDate       start        end      endDate
      if (
        (start - new Date(endDate) >= 0 && new Date(endDate) - start >= 0) ||
        (end - new Date(startDate) >= 0 && new Date(endDate) - end >= 0)
      ) {
        const err = new Error(
          "Sorry, a booking already exists within your reservation dates"
        );
        err.status = 403;
        err.errors = {
          message:
            "A reservation already exists within your start and end dates",
        };
        return next(err);
      }
    }

    const newBooking = await Booking.create({
      userId: user.id,
      spotId,
      startDate,
      endDate,
    });

    return res.status(201).json(newBooking);
  }
);

//! Always need to export the router
module.exports = router;
