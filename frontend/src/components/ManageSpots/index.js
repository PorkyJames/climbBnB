import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserSpotsThunk } from "../../store/spot";

import { NavLink } from "react-router-dom"

import TiledSpot from "../TiledSpot";

const ManageSpots = () => {

const dispatch = useDispatch();

const sessionUser = useSelector((state) => state.session)
const userSpots = useSelector((state) => Object.values(state.spots))

const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    dispatch(loadUserSpotsThunk()).then(() => setIsLoading(false))
}, [dispatch])

if (isLoading) {
    return (
        <p> Loading... </p>
        )
    } 

const spotsCreatedByUser = userSpots.filter((spot) => spot.ownerId === sessionUser.id)

//! Need to create an updateSpotThunk and a deleteSpotThunk

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
                <button>Update</button>
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
