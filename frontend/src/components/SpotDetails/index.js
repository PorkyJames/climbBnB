import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { loadSpotDetailsThunk } from "../../store/spot";

const SpotDetails = () => {
const dispatch = useDispatch();
const { spotId } = useParams();
const spotState = useSelector((state) => state.spots)
const eachSpotDetail = spotState[spotId]

const [isLoading, setIsLoading] = useState(true)

//! Destructure our Each Spot
const {
    Owner,
    SpotImages,
    address,
    average,
    city,
    country,
    description,
    name,
    numReviews,
    price,
    state } = eachSpotDetail;


useEffect(() => {
    dispatch(loadSpotDetailsThunk(spotId)).then(() => setIsLoading(false))
}, [dispatch, spotId])

if (!eachSpotDetail) {
    return <div>Loading...</div>
}

const reserveButtonAlert = () => {
    alert("Feature Coming Soon.")
};

    return (
        <div>
            {!isLoading && 
            <>

                <h1>{name}</h1>

                <p>Location: {city}, {state}, {country}</p>

                <p>Hosted by {Owner.firstName} {Owner.lastName}</p>

                <p>{description}</p>

                <div className="spot-reserve-box">
                    <div className="spot-reserve-box-price-and-reviews">
                        <p>${price} per night</p>
                        <p>Reviews Go here</p>
                    </div>
                    <button 
                        className ="reserve-button" 
                        onClick={reserveButtonAlert}>
                            Reserve
                    </button>
                </div>

            </>
            }
        </div>
    )
}

export default SpotDetails;
