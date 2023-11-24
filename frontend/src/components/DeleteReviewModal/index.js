import { useState } from "react";
import { UseSelector, useSelector } from "react-redux";

import "./DeleteReviewModal.css"

const DeleteReviewModal = ({ reviewId, onDelete, onClose }) => {
    const handleDelete = () => {
      onDelete(reviewId);
      onClose(); 
    };

    const handleCloseModal = (e) => {
      if (e.target.classList.contains("modal-background")) {
        onClose();
      }
    };
  
    return (
      <div id="modal" className="modal-background" onClick={handleCloseModal}>
        <div id="modal-content" className="modal-content">
        <button className="close-button" onClick={onClose}>
            &times;
        </button>
        <div className="modal-content">
          <div className="confirm-delete-text">
            <h2>Confirm Delete</h2> 
          </div>
          <div className="delete-review-paragraph">
            <p>Are you sure you want to delete this review?</p>
          </div>
          <div className="modal-buttons">
            <button className="delete-button" onClick={handleDelete}>
              Yes (Delete Review)
            </button>
            <button className="cancel-button" onClick={onClose}>
              No (Keep Review)
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  };
  
  export default DeleteReviewModal;
