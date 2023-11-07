import { Link } from "react-router-dom";

const TiledSpot = ({ spot }) => {

    //! Get all of the spot information
    const { id, name, city, state, price, avgStarRating, previewImage, description } = spot;

    //! If review exists / doesn't exist
    let rating;
    const reviewExists = () => {
        if (avgStarRating.length > 0) {
            avgStarRating = rating
        } else {
            rating = "New"
        }
        return rating;
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
                    <div className="spot-starRating" title={spot.name}>{reviewExists}</div>
                    <div className="spot-price" title={spot.name}>${spot.price}.00 / night</div>
                </div>
            </Link>
        </>
    )
};

export default TiledSpot;
