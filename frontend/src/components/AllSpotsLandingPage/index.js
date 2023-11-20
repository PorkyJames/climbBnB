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

    //! Format our AvgStarRating to return to the 2nd decimal place
    const formatAvgStarRating = (rating) => {
        return rating.toFixed(2);
    }

    //! If review exists / doesn't exist
    const reviewExists = (avgStarRating) => {
        if (avgStarRating && avgStarRating > 0) {
            return formatAvgStarRating(avgStarRating)
        } else {
            return "New"
        }
    }

    return (
        <>
          <div className="landing-page">
            {allSpots.map((spot) => {
              return (
                <Link to={`spot/${spot.id}`} key={spot.id}>
                  <TiledSpot spot={spot} />
                </Link>
              );
            })}
          </div>
        </>
      );
}

export default AllSpotsLandingPage
