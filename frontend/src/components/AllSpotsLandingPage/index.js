import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { loadAllSpotsThunk } from "../../store/spot"

const AllSpotsLandingPage = () => {

    const dispatch = useDispatch();
    const allSpots = useSelector((state) => Object.values(state.spots))


    useEffect(() => {
        dispatch(loadAllSpotsThunk())
    }, [dispatch])

    return(
        <>
            <h1>Here is all spots</h1>
        </>
    )
}

export default AllSpotsLandingPage
