import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserSpotsThunk } from "../../store/spot";

const ManageSpots = () => {

const dispatch = useDispatch();

const sessionUser = useSelector((state) => state.session)
const userSpots = useSelector((state) => Object.values(state.spot))

const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
    dispatch(loadUserSpotsThunk()).then(() => setIsLoading(false))
}, [dispatch])

if (userSpots === undefined) {
    return (
        <p> Loading... </p>
        )
    } 

    return (
        <div>
        {!isLoading &&
        <>
        <h1> Manage Spots Page</h1>
        {userSpots.map((spot) => (
            <li key={spot.id}>{spot.name}</li>
        ))}
        </>
        }
        </div>
    )
}

export default ManageSpots;
