import { useSelector, useDispatch } from "react-redux";
import { loadSpotReviewsThunk } from "../../store/review";
import { useEffect, useState } from "react";


const SpotDetailReviews = ({spotId}) => {

    const dispatch = useDispatch();
    const spotReviews = useSelector((state) => state.reviews[spotId]);
    
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        dispatch(loadSpotReviewsThunk(spotId)).then(() => setIsLoading(false));
    }, [dispatch, spotId]);

    if (spotReviews === undefined) {
        return (
            <p> Loading ...</p>
        )
    }

    return (
        <div>
            {!isLoading &&
            <>
            <div className="spot-detail-reviews">
                    <ul>
                        {spotReviews.Reviews.map((review) => (
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
            </div>
            </>
            }
        </div>
    );
}

export default SpotDetailReviews;
