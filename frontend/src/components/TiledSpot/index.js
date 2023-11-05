import { Link } from "react-router-dom";

const TiledSpot = ({ spot }) => {

    //! Get all of the spot information
    const { id, name, city, state, price, avgRating, previewImage, description } = spot;


    //! If review exists / doesn't exist
    let rating;
    const reviewExists = () => {
        if (spot.avgRating.length > 0) {
            avgRating = rating
        } else {
            rating = "New"
        }
    }
    
    return (
        <>
            <Link to={`/spot/${spot.id}`}>
                <div className="each-spot-tile-details">
                    <img src={spot.previewImage} className="spot-thumbnail" />
                    <div className="spot-city">{spot.name}</div>
                    <div className="spot-state">{spot.state}</div>
                    <div className="spot-starRating">{reviewExists}</div>
                    <div className="spot-price">${spot.price}.00 / night</div>
                </div>
            </Link>
        </>
    )
};

export default TiledSpot;
