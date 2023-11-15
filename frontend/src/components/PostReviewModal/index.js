import { useState } from "react";


const PostReviewModal = ({onClose, onSubmit }) => {
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

    return (
        <div className="full-modal">
        <div className="modal-content">
          <span className="x-button" onClick={onClose}>&times;</span>
          <h2>How was your stay?</h2>
  
          <label>
            Leave your review here:
            <textarea
              value={review}
              onChange={handleCommentChange}
              placeholder="Leave your review here..."
            />
          </label>
  
          <label>
            Stars:
            <div className="stars">{renderStars()}</div>
          </label>
  
          <button disabled={review.length < 10 || selectedRating === 0} onClick={handleSubmit}>
            Submit Your Review
          </button>
        </div>
      </div>
    )
}

export default PostReviewModal;
