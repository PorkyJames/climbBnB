import { useSelector, useDispatch } from "react-redux";

import { loadSpotReviewsThunk } from "../../store/review";
import { useEffect } from "react";


const SpotDetailReviews = ({spotId}) => {

    const dispatch = useDispatch();
    const spotReviews = useSelector((state) => state.reviews[spotId]);

    const newSpotReviews = spotReviews.Reviews;

    useEffect(() => {
        dispatch(loadSpotReviewsThunk(spotId));
    }, [dispatch, spotId]);

    const calculateTotalAvgRating = () => {
        //! Return New if nothing exists
        if (!spotReviews || spotReviews.length === 0) {
            return "New"
        }
        
        //! If reviews exists:
        //! Format and calculate the avg rating of reviews
        const totalStars = spotReviews.reduce((sum, review) => sum + review.stars, 0)
        const avgRating = (totalStars / spotReviews.length).toFixed(2)
        return avgRating;
    }

    //! Reassign avgRating to our function above for calculating the avgRating
    const avgRating = calculateTotalAvgRating();

    return (
        <div className="spot-detail-reviews">
                <ul>
                    {newSpotReviews.map((review) => (
                    <li key={review.id}>
                        <p>Review: {review.review}</p>
                        <div className ="spot-star-icon">
                            <i className="fas fa-star"></i>
                            <p>Stars: {review.stars}</p>
                        </div>
                        <p>Posted by: {review.User.firstName} {review.User.lastName}</p>
                    </li>
                    ))}
                </ul>
                <div className="average-rating">
                    {avgRating === "New" ? (<p>New</p> ) : 
                    (
                    <p>
                        <i className="fas fa-star"></i>
                        {avgRating}
                    </p>
                    )}
                </div>
        </div>
    );
}

export default SpotDetailReviews;
