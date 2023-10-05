const express = require('express');
const Sequelize = require('sequelize');
const { Review, ReviewImage, Spot, User, SpotImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth');
const router = express.Router();


//GET 

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const user = req.user;
    const userBookings = await Booking.findAll({
        where: {
            userId: user.id
        }
    })

    const bookingObj = {
        Bookings: []
    }
    for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i].dataValues;
        let spot = await Spot.findAll({
            where: {
                id: booking.spotId
            },
            attributes: {
                include: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                exclude: ['description','createdAt', 'updatedAt']
            }
        })
        spot = spot[0].dataValues;

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

        const bookingObj = {
            id: booking.id,
            spotId: booking.spotId,
            Spot: {
                ...spot,
                previewImage: imageUrl
            },
            userId: user.id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        bookingsRes.Bookings.push(bookingObj);
    }

    return res.status(200).json(bookingsRes);
});


//Get all Bookings for a Spot based on the Spot's id

//In our spots.js route file



//POST

//Create a booking from a Spot based on Spot's Id




//PUT

//Edit a booking

router.put('/:bookingId', requireAuth, async (req, res) => {
    
    //get our start and end dates
    const booking = await Booking.findByPk(req.params.bookingId);
    const { startDate, endDate } = req.body;
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    

    const user = req.user

    //if the booking doesn't exist
    if (!booking) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    //next we need to make sure that we can validate the booking
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

    if (startDate > endDate) {
        validationError.errors.endDate = "endDate cannot be on or before startDate"
    }

    if (validationError.errors.startDate || validationError.errors.endDate) {
        return res.status(400).json(validationError)
    }

    //if the booking isn't owned by the current user

    const spot = await Spot.findByPk(booking.spotId)

    if (booking.userId !== user.id) {
        return res.status(403).json({
            message: "You must be the owner of a booking to edit the booking"
        })
    }

    //if the dates don't align with what you're editing / booking
    const today = new Date();

    if (today > booking.endDate) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })    
    };

    //if start date has already passed
    if (today >= newStartDate && newStartDate > booking.startDate) {
        return res.status(403).json({
            message: "Start dates cannot be modified if booking has already begun"
        })
    }

    //if the spot you're booking for already has been booked for specified dates
    const dateError = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
    };

    let Op = Sequelize.Op
    
    //if there is an invalid start date
    const currentBookingsStartDate = await Booking.findAll({
        where: {
            spotId: spot.id,
            startDate: {
                [Op.lte]: newStartDate
            },
            endDate: 
            {
                [Op.gte]: newStartDate
            }
        }
    })

    if (newEndDate < today) {
        dateError.message = 'Sorry, you cannot book for the past'
        dateError.errors.booking = 'New booking cannot be in the past'
    }

    if (currentBookingsStartDate.length && !dateError.errors.booking) {
        dateError.errors.startDate = "Start date conflicts with an existing booking"
    }

    const currentBookingsEndDate = await Booking.findAll({
        where: {
            spotId: spot.id,
            startDate: {
                [Op.lte]: newEndDate
            },
            endDate: 
            {
                [Op.gte]: newEndDate
            }
        }
    })

    const currentBookingsBothDates = await Booking.findAll({
        where: {
            spotId: spot.id,
            startDate: {
                [Op.gte]: newStartDate
                    },
            endDate: {
                [Op.lte]: newEndDate
                    }
            }
        })
    

    if (currentBookingsBothDates.length) {
        dateError.errors.startDate = "Start date conflicts with an existing booking";
        dateError.errors.endDate = "End date conflics wtih an existing booking"
    }

    if (currentBookingsEndDate.length && !dateError.errors.booking) {
        dateError.errors.endDate = "End date conflicts with an exisiting booking"
    }

    if (dateError.errors.startDate || dateError.errors.endDate || dateError.errors.booking) {
        return res.status(403).json(dateError)
    }

    //if there are no more edge cases and we're going to just edit a new booking
    await booking.set({
        startDate: startDate,
        endDate: endDate
    });

    await booking.save();

    const updatedBooking = await Booking.findByPk(booking.id);

    return res.status(200).json(updatedBooking)
})


//DELETE

//Delete a booking
router.delete('/bookingId', requireAuth, async (req, res) => {
    const user = req.user;
    const bookingsList = await Booking.findByPk(req.params.bookingId);

    //if the booking doesn't exist
    if (!bookingsList) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    //if the booking doesn't belong to the current user
    const currSpot = await Spot.findByPk(bookingsList.spotId);
    if (user.id !== spot.ownerId && user.id !== bookingsList.userId) {
        return res.status(403).json({
            message: "You must own the booking or spot to delete the booking"
        })
    }

    //if booking has already been placed
    const newDay = new Date();

    if (newDay >= bookingsList.startdate) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        })
    }

    //then we delete
    await bookingsList.destroy()
    return res.status(200).json({
        message: "Successfully deleted"
    })

})

module.exports = router;