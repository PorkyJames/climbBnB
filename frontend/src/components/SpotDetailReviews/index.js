import { useSelector, useDispatch } from "react-redux";

import { loadSpotReviewsThunk } from "../../store/review";
import { useEffect } from "react";


const SpotDetailReviews = ({spotId}) => {

    const dispatch = useDispatch();
    const spotReviews = useSelector((state) => state.reviews[spotId]);


    useEffect(() => {
        dispatch(loadSpotReviewsThunk(spotId));
    }, [dispatch, spotId]);

    if (!spotReviews || spotReviews.length === 0) {
        return (
            <div className="spot-detail-reviews">
                <p>No reviews available for this spot.</p>
            </div>
        );
    }

    return (
        <div className="spot-detail-reviews">
                <ul>
                    {spotReviews.map((review) => (
                    <li key={review.id}>
                        <p>Review: {review.review}</p>
                        <p>Stars: {review.stars}</p>
                        <p>Posted by: {review.User.firstName} {review.User.lastName}</p>
                    </li>
                    ))}
                </ul>
        </div>
    );
}

export default SpotDetailReviews;
