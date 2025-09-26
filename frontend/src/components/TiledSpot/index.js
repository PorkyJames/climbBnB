import { Link } from "react-router-dom";
import "./TiledSpotCSS.css"


const TiledSpot = ({ spot }) => {
    
    //! Get all of the spot information
    const { id, name, city, state, price, avgStarRating, previewImage, description } = spot;

    //! Format our AvgStarRating to return to the 2nd decimal place
    const formatAvgStarRating = (rating) => {
        return rating.toFixed(2);
    }

    //! If review exists / doesn't exist
    const reviewExists = () => {
        if (avgStarRating && avgStarRating > 0) {
            return formatAvgStarRating(avgStarRating)
        } else {
            return "New"
        }
    }
    
    // console.log(spot.price)

    return (
        <>
            <Link to={`/spots/${spot.id}`}>
                <div key={spot.id} className="each-spot-tile-details">
                    <div title={spot.name}>
                        <div className="image-container">
                            <img src={spot.previewImage} className="spot-thumbnail" alt="spot-thumbnail"/>
                        </div>
                    </div>
                    {/* <div className="spot-name" title={spot.name}>{spot.name}</div> */}
                    <div className="spot-info-container">
                        <div className="spot-context">
                            <div className="spot-city-title">
                                {spot.name}
                            </div>
                            <div className="spot-city-state">
                                {spot.city}, {spot.state}
                            </div>
                            {/* <div className="spot-city" title={spot.city}>{spot.city}</div>
                            <div className="spot-state" title={spot.name}>{spot.state}</div> */}
                        </div>

                        <div className="spot-starRating" title={spot.name}>
                            <i className="fas fa-star"></i> 
                            {reviewExists()}
                        </div>
                    </div>

                    <div className="spot-price" title={spot.name}>${parseInt(spot.price).toFixed(2)} / night </div>
                </div>
            </Link>
        </>
    )
};

export default TiledSpot;
