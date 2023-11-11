import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { loadSpotDetailsThunk } from "../../store/spot";

import SpotDetailReviews from "../SpotDetailReviews";

const SpotDetails = () => {
const dispatch = useDispatch();
const { spotId } = useParams();

const spotState = useSelector((state) => state.spots[spotId])


const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    dispatch(loadSpotDetailsThunk(spotId)).then(() => setIsLoading(false))
}, [dispatch, spotId])

if (spotState === undefined) {
    return (
        <p> Loading... </p>
        )
    } 
    
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
        state } = spotState;

const avgStarRatingItem = spotState.average //5
const numReviewsItem = spotState.numReviews //1

const reserveButtonAlert = () => {
    alert("Feature Coming Soon.")
};

    return (
        <div>
            {!isLoading && 
            <>

                <h1>{name}</h1>

                {/* Our Large Image */}
                {SpotImages.length > 0 && <img src={SpotImages[0]?.url} 
                className="spot-details-large-image" />}

                {/* Our other Small Images */}
                <div className="spot-details-small-images">
                    {SpotImages.slice(1, 5).map((img, i) => (
                        <img key={i} src={img?.url} />
                    ))}
                </div>

                <p>Location: {city}, {state}, {country}</p>

                <p>Hosted by {Owner.firstName} {Owner.lastName}</p>

                <p>{description}</p>

                <div className="spot-reserve-box">
                    <div className="spot-reserve-box-price-and-reviews">
                        <p> CalloutInfoBox Down Here </p>
                        <p>${price} per night</p>
                        <p>Average Star Rating: {avgStarRatingItem}</p>
                        <p>Review Count: {numReviewsItem}</p>
                    </div>
                    <button 
                        className ="reserve-button" 
                        onClick={reserveButtonAlert}>
                            Reserve
                    </button>
                </div>

                <div className = "spot-details-review-section">
                    <h1> Spot Detail Reviews goes here</h1>
                    <SpotDetailReviews spotId={spotId} />
                </div>

            </>
            }
        </div>
    )
}

export default SpotDetails;
