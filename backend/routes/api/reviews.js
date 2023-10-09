const express = require('express');
const Sequelize = require('sequelize');
const { Review, ReviewImage, Spot, User, SpotImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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

//GET 

//Get all Reviews of Current User
router.get("/current", requireAuth, async (req, res, next) => {
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

  });


//POST

//Create a Review for a Spot based on the Spot's Id

//In our spots.js route file

//Add an Image to a Review based on the Review's Id

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    
    //if the review doesn't exist
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    //if the review doesn't belong to the current user
    const user = req.user;
    const dvReview = review.dataValues;

    if (user.id !== dvReview.userId) {
        return res.status(400).json({
            message: "Review must belong to the current user"
        })
    }

    //if there are more than 10 images for each review

    const images = await ReviewImage.findAll({
        where: {
            reviewId: dvReview.id
        }
    })

    if (images.length >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        })
    }

    //Add an image to review
    const { url } = req.body
    const addedReviewImage = await ReviewImage.create({
        url: url,
        reviewId: dvReview.id
    })

    return res.status(200).json({
        id: addedReviewImage,
        url: addedReviewImage.url
    })
})

//PUT

//Edit a Review
router.put('/:reviewId', requireAuth, validateCreateReview, async (req, res) => {
    const currReview = await Review.findByPk(req.params.reviewId);
    const user = req.user;

    //if the review doesn't exist
    if (!currReview) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    }

    //if the review doesn't belong to the current user
    if (user.id !== currReview.userId) {
        return res.status(403).json({
            message: "You must be the review owner to edit a review"
        })
    }

    const { review, stars } = req.body

    await currReview.set( {
        review: review,
        stars: stars

    })

    await currReview.save();

    const updatedReview = await Review.findByPk(currReview.id)

    return res.status(200).json(updatedReview)
})


//DELETE

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);
    const user = req.user

    //check to see if review exists
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found"
        })
    };

    if (user.id !== review.userId) {
        return res.status(403).json({
            message: "You must own a review to delete it"
        })
    };

    await review.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })

})

module.exports = router;
