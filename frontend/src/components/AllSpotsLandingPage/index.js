import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { loadAllSpotsThunk } from "../../store/spot"
import { Link } from "react-router-dom";

//! Component
import TiledSpot from "../TiledSpot";

const AllSpotsLandingPage = () => {

    const dispatch = useDispatch();
    const allSpots = useSelector((state) => Object.values(state.spots))

    useEffect(() => {
        dispatch(loadAllSpotsThunk())
    }, [dispatch])

    return(
        <>
            <div className = "landing-page">
                {allSpots.map((spot) => (
                    <Link to={`spot/${spot.id}`} key={spot.id}>
                        <TiledSpot spot={spot} />
                    </Link>
                ))}
            </div>
        </>
    )
}

export default AllSpotsLandingPage
