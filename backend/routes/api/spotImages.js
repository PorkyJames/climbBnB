const Sequelize = require('sequelize');
const express = require('express');
const { Review, ReviewImage, Spot, User, SpotImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const user = req.user;
    const imageId = req.params.imageId;
    const spotImage = await SpotImage.findByPk(imageId);

    //if the spot image doesn't exist
    if (!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found"
        })
    }

    //if the current user is not the owner
    const spot = await Spot.findByPk(spotImage.spotId)

    if (user.id !== spot.ownerId) {
        return res.status(403).json({
            message: "You must own the spot to delete an image"
        })
    }

    //then we can destroy our spot image
    await spotImage.destroy()

    //and then we can return our res.json message for successful deletion
    return res.json({
        message: "Successfully deleted"
    })

})

module.exports = router;