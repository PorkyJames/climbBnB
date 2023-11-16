import { useState } from "react";
import { UseSelector, useSelector } from "react-redux";

const DeleteReviewModal = ({ reviewId, onDelete, onClose }) => {
    const handleDelete = () => {
      onDelete(reviewId);
      onClose(); 
    };
  
    return (
      <div className="modal">
        <button className="close-button" onClick={onClose}>
            &times;
        </button>
        <div className="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this review?</p>
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
    );
  };
  
  export default DeleteReviewModal;
