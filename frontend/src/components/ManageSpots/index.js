import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteUserSpotThunk, loadUserSpotsThunk, updateUserSpotThunk } from "../../store/spot";
import { NavLink } from "react-router-dom"
import DeleteSpotModal from "../DeleteSpotModal";

import TiledSpot from "../TiledSpot";

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

    return (
        <div>
        {!isLoading &&
        <>
        <h1> Manage Spots</h1>
        {spotsCreatedByUser.length > 0 ? (
            <ul>
              {spotsCreatedByUser.map((spot) => (
                <li key={spot.id}>
                  <TiledSpot spot={spot} />
                  <button onClick={() => history.push(`/spots/${spot.id}/edit`)}>Update</button>
                  <button onClick={() => handleDelete(spot.id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No spots posted yet.
              <NavLink to="/spots/new">Create a New Spot</NavLink>
            </p>
          )}
          {showDeleteModal && (
          <DeleteSpotModal
            onCancel={() => setShowDeleteModal(false)}  
            onDelete={handleModalConfirm}              
          />
)}
        </>
        }
        </div>
    )
}

export default ManageSpots;
