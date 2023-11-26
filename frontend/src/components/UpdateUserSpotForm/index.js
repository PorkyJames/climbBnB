import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserSpotThunk } from "../../store/spot";
import { useHistory, useParams } from "react-router-dom";

import "./UpdateUserSpotForm.css"

const UpdateUserSpotForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams()
  const spot = useSelector((state) => state.spots[spotId]);

  // Create States for our Form
  const [country, setCountry] = useState(spot.country || "");
  const [address, setAddress] = useState(spot.address || "");
  const [city, setCity] = useState(spot.city || "");
  const [state, setState] = useState(spot.state || "");
  const [lng, setLng] = useState(spot.lng || 0);
  const [lat, setLat] = useState(spot.lat || 0);
  const [description, setDescription] = useState(spot.description || "");
  const [name, setName] = useState(spot.name || "");
  const [price, setPrice] = useState(parseInt(spot.price) || "");
  const [previewImageURL, setPreviewImageURL] = useState(spot.previewImageURL || "");
  const [imageURL1, setImageURL1] = useState(spot.imageURL1 || "");
  const [imageURL2, setImageURL2] = useState(spot.imageURL2 || "");
  const [imageURL3, setImageURL3] = useState(spot.imageURL3 || "");
  const [imageURL4, setImageURL4] = useState(spot.imageURL4 || "");

  // Set Error States for our Form (Add more if needed)
  const [countryError, setCountryError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [previewImageURLError, setPreviewImageURLError] = useState("");

  // Handle submit for form
  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate form fields (Add more if needed)

    if (!country) {
      setCountryError("Country is required");
      isValid = false;
    } else {
      setCountryError("");
    }

    if (!address) {
      setAddressError("Street Address is required");
      isValid = false;
    } else {
      setAddressError("");
    }

    if (!city) {
      setCityError("City is required");
      isValid = false;
    } else {
      setCityError("");
    }

    if (!state) {
      setStateError("State is required");
      isValid = false;
    } else {
      setStateError("");
    }

    if (description.length < 30) {
      setDescriptionError("Description needs 30 or more characters");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!name) {
      setNameError("Name of your Spot is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!price) {
      setPriceError("Price per night (USD) is required");
      isValid = false;
    } else {
      setPriceError("");
    }

    // When we submit our form, dispatch the form data to our thunk
    if (isValid) {
      const spotDataFromForm = {
        country,
        address,
        city,
        state,
        lng,
        lat,
        description,
        name,
        price,
        previewImageURL,
        imageURL1,
        imageURL2,
        imageURL3,
        imageURL4,
      };

      dispatch(updateUserSpotThunk(spotId, spotDataFromForm)).then((result) => {
        if (result) {
           history.push(`/spots/${result.id}`);
        }
      });
    }
  };

  // Reset form and errors when the spot changes
  useEffect(() => {
    setCountry(spot.country || "");
    setAddress(spot.address || "");
    setCity(spot.city || "");
    setState(spot.state || "");
    setLng(spot.lng || "");
    setLat(spot.lat || "");
    setDescription(spot.description || "");
    setName(spot.name || "");
    setPrice(spot.price || "");

    setCountryError("");
    setAddressError("");
    setCityError("");
    setStateError("");
    setDescriptionError("");
    setNameError("");
    setPriceError("");
  }, [spot]);

  return (
    <>
    <form onSubmit={handleSubmit}>
        <div>
            <h1>Update your Spot</h1>
        </div>

    {/*//! Section 1 */}
    <div className="section-one-create-form">
      <div className="section-one-text">
        <h2>Where's your place located?</h2>
        <p>Guests will only get your exact address once they booked a reservation.</p>
      </div>
        {/* //? Country Input */}
        <div className="country-label">
          <label htmlFor="country">Country</label>
          <div className="error-message">{countryError}</div>
        </div>
        <div className="country-input">
          <input 
              type="text"
              id="country"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* //? Street Address Input */}
        <div className="city-state-container">
          <div className="city-input">
            <label htmlFor="city">City</label>
            <div className="error-message">{cityError}</div>
            <input 
              type="text"
              id="city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="state-input">
            <label htmlFor="state">State</label>
            <div className="error-message">{stateError}</div>
            <input 
              type="text"
              id="state"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>

        {/* //? State Input
        <label htmlFor="state">State</label>
        <input 
            type="text"
            id="state"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
        />
        <div className="error-message">{stateError}</div> */}

      {/* //? Lat Input */}
        <div className="lat-lng-container">
            <div className="lat-input">
              <label htmlFor="latitude">Latitude</label>
              <input 
                type="text"
                id="lat"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div className="lng-input">
              <label htmlFor="longitude">Longitude</label>
              <input 
                type="text"
                id="lng"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>

    </div>
    {"_____________________________________________________________________________________"}

    {/* //! Section Two */}
    <div className="section-two-create-form">
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amenities 
          like fast wifi or parking, and what you love about the neighborhood.</p>
      <div className="description-container">
        <div className="description-text-area">
          <textarea
              id="description"
              placeholder="Please write at least 30 characters"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
          />
        <div className="error-message">{descriptionError}</div>
        </div>
      </div>
    </div>

    {"_____________________________________________________________________________________"}

      {/* //! Section Three */}
      <div className="section-three-create-form">
          <h2>Create a title for your spot</h2>
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          <div className="spot-name-input">
            <input 
                type="text"
                id="name"
                placeholder="Name of your spot"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="error-message">{nameError}</div>
      </div>

    
      {"_____________________________________________________________________________________"}

      {/* //! Section Four */}
      <div className="section-four-create-form">
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <div className="price-container">
          <span className="dolla-dolla-sign">$</span>
          <input
            type="text"
            id="spotPrice"
            className="price-input"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="error-message">{priceError}</div>
      </div>


    {/* //! Section Five */}
    <div className="section-five-create-form">
      <div className="section-five-header-text">
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
      </div>
      <div className="preview-img-class">
        <input
            type="text"
            id="previewImageURL"
            name="previewImageURL"
            placeholder="Preview Image URL"
            value={previewImageURL}
            onChange={(e) => setPreviewImageURL(e.target.value)}
        />
      </div>
        <div className="error-message">{previewImageURLError}</div>

    <div className="img-url-1-class">
        <input
            type="text"
            id="imageURL1"
            name="imageURL1"
            placeholder="Image URL"
            value={imageURL1}
            onChange={(e) => setImageURL1(e.target.value)}
        />
    </div>

    <div className="img-url-2-class">
        <input
            type="text"
            id="imageURL2"
            name="imageURL2"
            placeholder="Image URL"
            value={imageURL2}
            onChange={(e) => setImageURL2(e.target.value)}
        />
    </div>

    <div className="img-url-3-class">
        <input
            type="text"
            id="imageURL3"
            name="imageURL3"
            placeholder="Image URL"
            value={imageURL3}
            onChange={(e) => setImageURL3(e.target.value)}
        />
    </div>

    <div className="img-url-4-class">
        <input
            type="text"
            id="imageURL4"
            name="imageURL4"
            placeholder="Image URL"
            value={imageURL4}
            onChange={(e) => setImageURL4(e.target.value)}
        />
    </div>
    
    {"_____________________________________________________________________________________"}
        
        {/* //! Submit Button */}
        <div className="create-form-submit-button">
            <button>Update Spot</button>
        </div>

    </div>
    </form>
    </>
)
};

export default UpdateUserSpotForm;
