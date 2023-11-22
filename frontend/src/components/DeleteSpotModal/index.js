import "./DeleteSpotModal.css"

const DeleteSpotModal = ({ onCancel, onDelete }) => {
    
  const handleCloseModal = (e) => {
    if (e.target.classList.contains("delete-spot-modal-overlay")) {
      onCancel();
    }
  };

    return (
      <div id="modal" className="delete-spot-modal-overlay" onClick={handleCloseModal}>
        <div id="modal-content" className="modal-content">
          <span className="x-button" onClick={onCancel}>&times;</span>
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
