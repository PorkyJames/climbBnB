import { useSelector, useDispatch } from "react-redux";
import { loadSpotReviewsThunk } from "../../store/review";
import { useEffect, useState } from "react";

import PostReviewModal from '../PostReviewModal'

const SpotDetailReviews = ({spotId}) => {

    const dispatch = useDispatch();
    const spotReviews = useSelector((state) => state.reviews[spotId]);
    const sessionUser = useSelector((state) => state.session.user)
    
    const [isLoading, setIsLoading] = useState(true)
    const [showReviewModal, setShowReviewModal] = useState(false)

    useEffect(() => {
        dispatch(loadSpotReviewsThunk(spotId)).then(() => setIsLoading(false));
    }, [dispatch, spotId]);

    const openReviewModal = () => {
        setShowReviewModal(true);
    }

    const closeReviewModal = () => {
        setShowReviewModal(false);
    }

    const hasUserReviewedSpot = () => {

        return spotReviews && spotReviews.Reviews.some(review => review.userId === sessionUser?.id);
      };

      const renderPostReviewButton = () => {
        if (!sessionUser) {
          return null;
        }
    
        if (hasUserReviewedSpot()) {
          return null;
        }
    
        return (
          <button onClick={openReviewModal}>Post Your Review</button>
        );
      };

    if (spotReviews === undefined) {
        return (
            <p> Loading ...</p>
        )
    }

    // Calculate average rating and review count
    const calculateTotalAvgRating = () => {
        if (!spotReviews || !spotReviews.Reviews || spotReviews.Reviews.length === 0) {
            return "New";
        }

        const totalStars = spotReviews.Reviews.reduce((sum, review) => sum + review.stars, 0);
        const avgRating = (totalStars / spotReviews.Reviews.length).toFixed(2);
        return avgRating;
    };

    const avgRating = calculateTotalAvgRating();

   // Render content conditionally based on the number of reviews
    const reviewCount = spotReviews ? spotReviews.Reviews.length : 0;

    return (
        <div>
            {!isLoading && (
                <>
                    <div className="spot-detail-reviews">
                        <div className="star-rating">
                            <i className="fas fa-star"></i>
                            {renderPostReviewButton()}
                            {showReviewModal && (
                                <PostReviewModal onClose={closeReviewModal} />
                            )}
                            {avgRating === "New" ? (
                                <p>New</p>
                            ) : (
                                <p>
                                    {avgRating}
                                    {reviewCount > 0 && <span className="centered-dot"> · </span>}
                                </p>
                            )}
                        </div>
                        {reviewCount > 0 && (
                            <div className="review-count">
                                <p>{reviewCount} {reviewCount === 1 ? "Review" : "Reviews"}</p>
                            </div>
                        )}
                        <ul className="review-list">
                            {reviewCount > 0 ? (
                                spotReviews.Reviews.map((review, index) => (
                                    <li key={review.id}>
                                        <div className="review-header">
                                            <p>{review.User.firstName} {review.User.lastName}</p>
                                            <p>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <p className="review-comment">{review.review}</p>
                                    </li>
                                ))
                            ) : (
                                <p className="no-reviews-text">Be the first to post a review!</p>
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default SpotDetailReviews;
