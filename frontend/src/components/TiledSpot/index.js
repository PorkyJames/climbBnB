import { Link } from "react-router-dom";

const TiledSpot = ({ spot }) => {

    //! Get all of the spot information
    const { id, name, city, state, price, avgRating, previewImage, description } = spot

    
    

    return (
        <Link to={`/spot/${spot.id}`}>
            <div className="spot-details">
                <div>Spot Name</div>
                <div>Spot City</div>
                <div>Spot State</div>
                <div>Spot Star Rating</div>
                <div>Spot Price</div>
            </div>
        </Link>
    )
};

export default TiledSpot;
