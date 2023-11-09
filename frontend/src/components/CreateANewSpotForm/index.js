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

    //! Handle submit for form
    const handleSubmit = (e) => {
        e.preventDefault();

        //! When we submit our form, we're going to dispatch the form data to our thunk
        const formData = {
            country,
            streetAddress,
            city,
            state
        }
        dispatch(createNewSpotThunk(formData))
    }


    
    return (
        <>
        <form>
            <div>
                <h1>Create a New Spot</h1>
            </div>

        </form>
        </>
    )
}

export default CreateANewSpotForm;
