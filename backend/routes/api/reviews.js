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
router.get('/current', requireAuth, async (req, res) => {
    //get our current userId
    const userId = req.user.id;

    //find all of the reviews by the current user:
    const allUserReviews = await Review.findAll({
        where: {
            userId
        }
    });

    //Convert our all user Reviews into json format
    const newUserReviews = allUserReviews.map(review => {
        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: review.User,
            Spot: review.Spot,
        };
    })

    return res.status(200).json(newUserReviews)
})


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
