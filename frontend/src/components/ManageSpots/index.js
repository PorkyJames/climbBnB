import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteUserSpotThunk, loadUserSpotsThunk, updateUserSpotThunk } from "../../store/spot";
import { NavLink } from "react-router-dom"
import DeleteSpotModal from "../DeleteSpotModal";

import TiledSpot from "../TiledSpot";

import "./ManageSpots.css"

const ManageSpots = () => {

const dispatch = useDispatch();
const history = useHistory();

const sessionUser = useSelector((state) => state.session.user)
const userSpots = useSelector((state) => Object.values(state.spots))

const [isLoading, setIsLoading] = useState(true)

//! DeleteSpotModal
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [spotToDelete, setSpotToDelete] = useState(null);

useEffect(() => {
    dispatch(loadUserSpotsThunk()).then(() => setIsLoading(false))
}, [dispatch])

if (isLoading) {
    return <p> Loading... </p>    
    } 

const spotsCreatedByUser = userSpots.filter((spot) => spot.ownerId === sessionUser.id)

const handleUpdate = (spotId) => {
  dispatch(updateUserSpotThunk(spotId))
}

//! DeleteSpotModal
const handleDelete = (spotId) => {
  setSpotToDelete(spotId);
  setShowDeleteModal(true);
};

const handleModalConfirm = () => {
  if (spotToDelete) {
    dispatch(deleteUserSpotThunk(spotToDelete))
    setSpotToDelete(null);
  }
  setShowDeleteModal(false);
};

const handleNewSpotClick = () => {
  history.push('/spots/new')
}

    return (
        <div>
        {!isLoading &&
        <div className="entire-manage-spot-page">
      
        <h1>Manage Spots</h1>
        <div className="new-spot-button">
          <button onClick={handleNewSpotClick}>Create a New Spot</button>
        </div>

        <div className="spot-list-manage">
          {spotsCreatedByUser.length > 0 ? (
            spotsCreatedByUser.map((spot) => (
              <div className="spot-container" key={spot.id}>
                <TiledSpot spot={spot} />
                <div className="buttons-container">
                  <div className="update-spot-button">
                    <button onClick={() => history.push(`/spots/${spot.id}/edit`)}>Update</button>
                  </div>
                  <div className="delete-spot-button">
                    <button onClick={() => handleDelete(spot.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-spots-container">
              {/* <div className="new-spot-button">
                <button onClick={handleNewSpotClick}>Create a New Spot</button>
              </div> */}
              <div className="no-spots-text">
                <p>No spots posted yet.</p>
              </div>
            </div>
          )}
        </div>
          {showDeleteModal && (
          <DeleteSpotModal
            onCancel={() => setShowDeleteModal(false)}  
            onDelete={handleModalConfirm}              
          />
          )}
        </div>
        }
        </div>
    )
}

export default ManageSpots;
