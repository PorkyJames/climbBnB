import { useState } from "react";
import "./PostReviewModal.css"

import {loadSpotDetailsThunk} from "../../store/spot"
import {useDispatch} from "react-redux"
import { useParams } from "react-router-dom";

const PostReviewModal = ({onClose, onSubmit }) => {

  const dispatch = useDispatch();
  const { spotId } = useParams();

    const [review, setReview] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
  
    const handleCommentChange = (e) => {
      setReview(e.target.value);
    };
  
    const handleStarHover = (hoveredStar) => {
      setHoveredRating(hoveredStar);
    };
  
    const handleStarClick = (clickedStar) => {
      setSelectedRating(clickedStar);
      //! Reset after clicking
      setHoveredRating(0); 
    };
  
    const handleSubmit = () => {
      const reviewData = {
        review,
        stars: selectedRating,
      };

      //! Comes from the onSubmit in the SpotDetailsReviews component
      onSubmit(reviewData);
    };
  
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          const ratingStars = (i <= hoveredRating || i <= selectedRating) ? '★' : '☆';
          stars.push(
            <span
              key={i}
              className="star"
              onMouseEnter={() => handleStarHover(i)}
              onClick={() => handleStarClick(i)}
              onMouseLeave={() => setHoveredRating(0)}
              role="button"
            >
              {ratingStars} 
            </span>
          );
        }
        return stars;
      };

    const handleCloseModal = (e) => {
      if (e.target.classList.contains("post-review-modal-overlay")) {
        onClose();
      }
    };

    return (
      <div id="modal" className="post-review-modal-overlay" onClick={handleCloseModal}>
        <div id="modal-content" className="modal-content">
            <span className="x-button" onClick={onClose}>&times;</span>
            <div className="review-title">
              <h2>How was your stay?</h2>
            </div>

          <div className="review-input-box">
            <textarea
              value={review}
              onChange={handleCommentChange}
              placeholder="Leave your review here..."
            />
          </div>
    
          <div className="starRating-icons">
            <label>
              <div className="stars">{renderStars()} Stars</div>
            </label>
          </div>
    
          <div className="submit-review-button">
            <button disabled={review.length < 10 || selectedRating === 0} onClick={handleSubmit}>
              Submit Your Review
            </button>
          </div>
        </div>
    </div>
    )
}

export default PostReviewModal;
