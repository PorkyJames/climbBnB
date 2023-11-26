import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { loadSpotDetailsThunk } from "../../store/spot";
import { loadSpotReviewsThunk } from "../../store/review";

import SpotDetailReviews from "../SpotDetailReviews";
import "./SpotDetailsCSS.css"

const SpotDetails = () => {
const dispatch = useDispatch();
const { spotId } = useParams();

const spotState = useSelector((state) => state.spots[spotId])

const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    dispatch(loadSpotDetailsThunk(spotId)).then(() => setIsLoading(false))
}, [dispatch, spotId])

useEffect(() => {
    dispatch(loadSpotReviewsThunk(spotId));
  }, [dispatch, spotId]);

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
        avgStarRating,
        city,
        country,
        description,
        name,
        numReviews,
        price,
        state } = spotState;

const avgStarRatingItem = spotState.avgStarRating //5
// console.log(avgStarRatingItem)
const numReviewsItem = spotState.numReviews //1

const reserveButtonAlert = () => {
    alert("Feature Coming Soon...")
};

    return (
        <div className="entire-page">
            {!isLoading && 
            <>

                <h1>{name}</h1>

                <p>{city}, {state}, {country}</p>

                <div className="spot-details-images-container">
                    {/* Our Large Image */}
                    <div className="spot-details-large-image-container">
                    {SpotImages.length > 0 && (
                        <img
                        src={SpotImages[0]?.url}
                        alt="Spot Preview"
                        className="spot-details-large-image"
                        />
                    )}
                    </div>

                    {/* Our other Small Images */}

                    <div className="spot-details-small-images-container">
                        {SpotImages.slice(1).map((img, i) => (
                        <img
                            key={i}
                            src={img?.url}
                            alt={`Spot Image ${i + 1}`}
                            className="spot-details-small-image"
                        />
                        ))}
                    </div>
                </div>
            
            <div className="second-half-spot-details-container">
                <div className="text-container">
                    <div className="hosted-by">
                        <p>Hosted by {Owner.firstName} {Owner.lastName}</p>
                    </div>

                    <div className="description">
                        <p>{description}</p>
                    </div>
                </div>

            <div className="callout-info-box-container">
                <div className="spot-reserve-box-price-and-reviews">
                    {/* <p> CalloutInfoBox Down Here </p> */}
                    <p className="smol-price">${price} night</p>
                    <div className="rating-review-container">
                    <p className="smol-avgRating">
                        <i className="fas fa-star"></i>
                        {avgStarRatingItem ? <>{avgStarRatingItem.toFixed(2)}<span className="interpunct-adjust">·</span></> : "New"}
                    </p>
                        {numReviewsItem > 0 && (
                            <p className="smol-reviewItem">
                            {numReviewsItem} {numReviewsItem === 1 ? "Review" : "Reviews"}
                            </p>
                        )}
                    </div>
                </div>
                <div className="reserve-button">
                    <button onClick={reserveButtonAlert}>Reserve</button>
                </div>
            </div>
</div>  

                <div className = "spot-details-review-section">
                    <SpotDetailReviews spotId={spotId} />
                </div>

            </>
            }
        </div>
    )
}

export default SpotDetails;
