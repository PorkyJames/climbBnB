import { Link } from "react-router-dom";


const TiledSpot = ({ spot }) => {
    
    //! Get all of the spot information
    const { id, name, city, state, price, avgStarRating, previewImage, description } = spot;

    //! Format our AvgStarRating to return to the 2nd decimal place
    const formatAvgStarRating = (rating) => {
        return rating.toFixed(2);
    }

    //! If review exists / doesn't exist
    const reviewExists = () => {
        if (avgStarRating > 0) {
            return avgStarRating
        } else {
            return "New"
        }
    }
    
    return (
        <>
            <Link to={`/spot/${spot.id}`}>
                <div className="each-spot-tile-details">
                    <div title={spot.name}>
                        <img src={spot.previewImage} className="spot-thumbnail" />
                    </div>
                    <div className="spot-city" title={spot.name}>{spot.name}</div>
                    <div className="spot-state" title={spot.name}>{spot.state}</div>
                    <div>
                        <div className="spot-starRating" title={spot.name}>
                            <i className="fas fa-star"></i>
                            {formatAvgStarRating(reviewExists())}
                        </div>
                    </div>
                    <div className="spot-price" title={spot.name}>${spot.price}.00 / night</div>
                </div>
            </Link>
        </>
    )
};

export default TiledSpot;
