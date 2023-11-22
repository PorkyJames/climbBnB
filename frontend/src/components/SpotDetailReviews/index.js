import { useSelector, useDispatch } from "react-redux";
import { loadSpotReviewsThunk } from "../../store/review";
import { useEffect, useState } from "react";

import { postSpotReviewThunk } from "../../store/review";
import { deleteSpotReviewThunk } from "../../store/review";

import PostReviewModal from '../PostReviewModal'
import DeleteReviewModal from "../DeleteReviewModal";

const SpotDetailReviews = ({spotId}) => {

    const dispatch = useDispatch();
    const spotReviews = useSelector((state) => state.reviews[spotId]);
    const sessionUser = useSelector((state) => state.session.user)
    const spotState = useSelector((state) => state.spots[spotId])
    
    const [isLoading, setIsLoading] = useState(true)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [reviewToDelete, setReviewToDelete] = useState(null)
    const [sortedReviews, setSortedReviews] = useState([]);

    useEffect(() => {
        dispatch(loadSpotReviewsThunk(spotId)).then(() => setIsLoading(false));
    }, [dispatch, spotId]);


    useEffect(() => {
        if (spotReviews) {
            const sortedReviews = spotReviews.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setSortedReviews(sortedReviews);
        }
    }, [spotReviews]);

    //* Review Modal
    const openReviewModal = () => {
        setShowReviewModal(true);
    }

    const closeReviewModal = () => {
        setShowReviewModal(false);
    }

    const openDeleteModal = (reviewId) => {
        setReviewToDelete(reviewId);
        setShowDeleteModal(true);
    };
    
    const closeDeleteModal = () => {
        setReviewToDelete(null);
        setShowDeleteModal(false);
    };

    const handleSubmitReview = (reviewData) => {
        dispatch(postSpotReviewThunk(spotId, reviewData)).then(() => {
          //! Reload reviews after posting a new review
        dispatch(loadSpotReviewsThunk(spotId));
        setShowReviewModal(false);
        });
    };

    const handleDeleteReview = (reviewId) => {
        dispatch(deleteSpotReviewThunk(spotId, reviewId));
        dispatch(loadSpotReviewsThunk(spotId));
        closeDeleteModal();
    };

    const hasUserReviewedSpot = () => {
        if (!spotReviews || !sessionUser || !spotState) {
            return false;
        }
        
        const sessionUserId = sessionUser.id;
        
          // Check if the logged-in user has written a review for any spot
        const userReviewedSpot = spotReviews.some(
            (review) => review.userId === sessionUserId
        );
        
        return userReviewedSpot;
    };

    const renderPostReviewButton = () => {
        if (!sessionUser) {
            return null;
        }

        if (sessionUser.id === spotState.ownerId) {
            // Hide the button for the spot's owner
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

    //! Calculate average rating and review count
    const calculateTotalAvgRating = () => {
        if (!spotReviews || !spotReviews || spotReviews.length === 0) {
            return "New";
        }

        const totalStars = spotReviews.reduce((sum, review) => sum + review.stars, 0);
        const avgRating = (totalStars / spotReviews.length).toFixed(2);
        return avgRating;
    };

    const avgRating = calculateTotalAvgRating();

   //! Render content conditionally based on the number of reviews
    const reviewCount = spotReviews ? spotReviews.length : 0;

    return (
        <div>
            {!isLoading && (
                <>
                    <div className="spot-detail-reviews">
                        <div className="star-rating">
                            {renderPostReviewButton()}
                            {showReviewModal && (
                                <PostReviewModal onClose={closeReviewModal} onSubmit={handleSubmitReview} />
                                )}
                            {avgRating === "New" ? (      
                                    <p>
                                        <i className="fas fa-star"></i>
                                        New
                                    </p>
                                ) : (
                                    <p>
                                    <i className="fas fa-star"></i>
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
                            {sortedReviews && sortedReviews.length > 0 ? (
                                sortedReviews.map((review, index) => (
                                    <li key={review.id}>
                                        <div className="review-header">
                                            {review.User && (
                                                <p>{review.User.firstName} {review.User.lastName}</p>
                                            )}
                                            <p>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                        <p className="review-comment">{review.review}</p>
                                        {sessionUser && review && review.User && review.User.id === sessionUser.id && (
                                            <button onClick={() => openDeleteModal(review.id)}>Delete</button>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p className="no-reviews-text">Be the first to post a review!</p>
                            )}
                        </ul>
                    </div>
                    {showDeleteModal && (
                        <DeleteReviewModal
                            reviewId={reviewToDelete}
                            onDelete={handleDeleteReview}
                            onClose={closeDeleteModal}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default SpotDetailReviews;
