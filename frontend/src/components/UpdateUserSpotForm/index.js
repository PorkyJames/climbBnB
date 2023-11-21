import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserSpotThunk } from "../../store/spot";
import { useHistory, useParams } from "react-router-dom";


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
            <h1>Update your Existing Spot</h1>
        </div>

    {/*//! Section 1 */}
    <div className="section-one-create-form">
        <h2>Where's your place located?</h2>
        <p>Guests will only get your exact address once they booked a reservation.</p>
        {/* //? Country Input */}
        <label htmlFor="country">Country</label>
        <input 
            type="text"
            id="country"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
        />
        <div className="error-message">{countryError}</div>

        {/* //? Street Address Input */}
        <label htmlFor="streetAddress">Street Address</label>
        <input 
            type="text"
            id="address"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
        />
        <div className="error-message">{addressError}</div>

        {/* //? City Input */}
        <label htmlFor="city">City</label>
        <input 
            type="text"
            id="city"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
        />
        <div className="error-message">{cityError}</div>

        {/* //? State Input */}
        <label htmlFor="state">State</label>
        <input 
            type="text"
            id="state"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
        />
        <div className="error-message">{stateError}</div>

      {/* //? Lat Input */}
      <label htmlFor="latitude">Latitude</label>
          <input 
              type="text"
              id="lat"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
          />
          {/* <div className="error-message">{stateError}</div> */}


        {/* //? Lng Input */}
        <label htmlFor="longitude">Longitude</label>
        <input 
            type="text"
            id="lng"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
        />
        {/* <div className="error-message">{stateError}</div> */}

    </div>

    {/* //! Section Two */}
    <div className="section-two-create-form">
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <label htmlFor="description">Description</label>
        <textarea
            id="description"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        <div className="error-message">{descriptionError}</div>
    </div>

    {/* //! Section Three */}
    <div className="section-three-create-form">
        <h2>Create a title for your spot</h2>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <label htmlFor="spotTitle">Name of your Spot</label>
        <input 
            type="text"
            id="name"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        <div className="error-message">{nameError}</div>
    </div>

    {/* //! Section Four */}
    <div className="section-four-create-form">
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <label htmlFor="spotPrice">Price</label>
        <input
            type="text"
            id="spotPrice"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
        />
        <div className="error-message">{priceError}</div>
    </div>

    {/* //! Section Five */}
    <div className="section-five-create-form">
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <label htmlFor="previewImageURL">Preview Image URL:</label>
        <input
            type="text"
            id="previewImageURL"
            name="previewImageURL"
            placeholder="Preview Image URL"
            value={previewImageURL}
            onChange={(e) => setPreviewImageURL(e.target.value)}
        />
        <div className="error-message">{previewImageURLError}</div>


        <label htmlFor="imageURL1">Image URL 1:</label>
        <input
            type="text"
            id="imageURL1"
            name="imageURL1"
            placeholder="Image URL"
            value={imageURL1}
            onChange={(e) => setImageURL1(e.target.value)}
        />
        <label htmlFor="imageURL2">Image URL 2:</label>
        <input
            type="text"
            id="imageURL2"
            name="imageURL2"
            placeholder="Image URL"
            value={imageURL2}
            onChange={(e) => setImageURL2(e.target.value)}
        />
        <label htmlFor="imageURL3">Image URL 3:</label>
        <input
            type="text"
            id="imageURL3"
            name="imageURL3"
            placeholder="Image URL"
            value={imageURL3}
            onChange={(e) => setImageURL3(e.target.value)}
        />
        <label htmlFor="imageURL4">Image URL 4:</label>
        <input
            type="text"
            id="imageURL4"
            name="imageURL4"
            placeholder="Image URL"
            value={imageURL4}
            onChange={(e) => setImageURL4(e.target.value)}
        />

        {/* //! Submit Button */}
        <div className="update-form-submit-button">
            <button>Update Spot</button>
        </div>
    </div>
    </form>
    </>
)
};

export default UpdateUserSpotForm;
