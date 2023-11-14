const DeleteSpotModal = ({ onCancel, onDelete }) => {
    
    return (
      <div className="delete-spot-modal">
        <div className="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to remove this spot?</p>
          <div className="button-container">
            <button className="delete-button" onClick={onDelete}>
              Yes (Delete Spot)
            </button>
            <button className="cancel-button" onClick={onCancel}>
              No (Keep Spot)
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteSpotModal;
