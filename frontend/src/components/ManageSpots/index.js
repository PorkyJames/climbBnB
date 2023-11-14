import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteUserSpotThunk, loadUserSpotsThunk, updateUserSpotThunk } from "../../store/spot";
import { NavLink } from "react-router-dom"

import TiledSpot from "../TiledSpot";

const ManageSpots = () => {

const dispatch = useDispatch();
const history = useHistory();

const sessionUser = useSelector((state) => state.session.user)
const userSpots = useSelector((state) => Object.values(state.spots))

const [isLoading, setIsLoading] = useState(true)

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

const handleDelete = (spotId) => {
  dispatch(deleteUserSpotThunk(spotId))
}

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
                  <button>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No spots posted yet.
              <NavLink to="/spots/new">Create a New Spot</NavLink>
            </p>
          )}
        </>
        }
        </div>
    )
}

export default ManageSpots;
