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
    const user = req.user
    const userReviews = await Review.findAll({
        where: {
            userId: user.id
        }
    })

    console.log(userReviews)

    const reviewRes = {
        Reviews: [],

    }

    for (let i = 0; i < userReviews.length; i++) {
        const review = userReviews[i].dataValues;

        const userObj = await User.findByPk(user.id)
        const refinedUser = userObj.dataValues

        const spot = await Spot.findByPk(review.spotId);
        const refinedSpot = spot.dataValues

        const spotImage = await SpotImage.findAll({
            where: {
                preview: true
            }
        })

        let imageUrl; 
        if (!spotImage.length) imageUrl = 'none'
        else imageUrl = spotImage[0].dataValues.url

        const reviewImages = await ReviewImage.findAll({
            where: {
                reviewId: review.id
            },
            attributes: {
                include: ['id', 'url'],
                exclude: ['reviewId', 'createdAt', 'updatedAt']
            }
        })

        // let allReviewImages = [];

        // for (let i = 0; i < reviewImages.length; i++) {

        // }

        // console.log(userObj)

        const reviewObj = {
            ...review,
            User: {
                id: refinedUser.id,
                firstName: refinedUser.firstName,
                lastName: refinedUser.lastName
            },
            Spot: {
                id: refinedSpot.id,
                ownerId: refinedSpot.ownerId,
                address: refinedSpot.address,
                city: refinedSpot.city,
                state: refinedSpot.state,
                country: refinedSpot.country,
                lat: refinedSpot.lat,
                lng: refinedSpot.lng,
                name: refinedSpot.name,
                price: refinedSpot.price,
                previewImage: imageUrl
            },
            ReviewImages: reviewImages
        }

        reviewRes.Reviews.push(reviewObj);

    }

    return res.status(200).json(reviewRes)
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
