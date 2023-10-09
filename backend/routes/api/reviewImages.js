const Sequelize = require('sequelize');
const express = require('express');
const { Review, ReviewImage, Spot, User, SpotImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const user = req.user;
    const imageId = req.params.imageId
    const reviewImage = await ReviewImage.findByPk(imageId);

    //if our review image doesn't exist
    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
        })
    }

    //if the current user is not the owner of the review / review Image
    const review = await Review.findByPk(reviewImage.reviewId);

    if (user.id !== review.userId) {
        return res.status(403).json ({
            message: "You must be the review owner to delete an image"
        })
    }

    //then we delete the review image if all edge cases are met
    await reviewImage.destroy();

    //return the res.json status if successfully destroyed
    return res.json({
        message: "Successfully deleted"
    })
})

module.exports = router
