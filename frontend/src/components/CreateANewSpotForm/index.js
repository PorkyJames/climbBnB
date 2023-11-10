import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewSpotThunk } from "../../store/spot";

const CreateANewSpotForm = () => {
    
    const dispatch = useDispatch();
    
    //! Create States for our Forms
    const [country, setCountry] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [description, setDescription] = useState("")
    const [spotTitle, setSpotTitle] = useState("")
    const [spotPrice, setSpotPrice] = useState("")
    const [previewImageURL, setPreviewImageURL] = useState("");
    const [imageURL1, setImageURL1] = useState("");
    const [imageURL2, setImageURL2] = useState("");
    const [imageURL3, setImageURL3] = useState("");
    const [imageURL4, setImageURL4] = useState("");

    //! Set Error States for our Form
    const [countryError, setCountryError] = useState('');
    const [streetAddressError, setStreetAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [spotTitleError, setSpotTitleError] = useState('');
    const [spotPriceError, setSpotPriceError] = useState('');
    const [previewImageURLError, setPreviewImageURLError] = useState('');


    //! Handle submit for form
    const handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!country) {
            setCountryError('Country is required');
            isValid = false;
        } else {
            setCountryError('');
        }

        if (!streetAddress) {
            setStreetAddressError('Street Address is required');
            isValid = false;
          } else {
            setStreetAddressError('');
          }
      
          if (!city) {
            setCityError('City is required');
            isValid = false;
          } else {
            setCityError('');
          }
      
          if (!state) {
            setStateError('State is required');
            isValid = false;
          } else {
            setStateError('');
          }
      
          if (description.length < 30) {
            setDescriptionError('Description needs 30 or more characters');
            isValid = false;
          } else {
            setDescriptionError('');
          }
      
          if (!spotTitle) {
            setSpotTitleError('Name of your Spot is required');
            isValid = false;
          } else {
            setSpotTitleError('');
          }
      
          if (!spotPrice) {
            setSpotPriceError('Price per night (USD) is required');
            isValid = false;
          } else {
            setSpotPriceError('');
          }
      
          if (!previewImageURL) {
            setPreviewImageURLError('Preview Image URL is required');
            isValid = false;
          } else {
            setPreviewImageURLError('');
          }

        //! When we submit our form, we're going to dispatch the form data to our thunk
        if (isValid){
            const formData = {
                country,
                streetAddress,
                city,
                state,
                description,
                spotTitle,
                spotPrice,
                previewImageURL,
                imageURL1,
                imageURL2,
                imageURL3,
                imageURL4,
            }
            dispatch(createNewSpotThunk(formData))
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <h1>Create a New Spot</h1>
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
                id="streetAddress"
                placeholder="Street Address"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
            />
            <div className="error-message">{streetAddressError}</div>

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
                id="spotTitle"
                placeholder="Name of your spot"
                value={spotTitle}
                onChange={(e) => setSpotTitle(e.target.value)}
            />
            <div className="error-message">{spotTitleError}</div>
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
                value={spotPrice}
                onChange={(e) => setSpotPrice(e.target.value)}
            />
            <div className="error-message">{spotPriceError}</div>
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
            <div className="create-form-submit-button">
                <button>Create Spot</button>
            </div>
        </div>
        </form>
        </>
    )
}

export default CreateANewSpotForm;
