import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewSpotThunk } from "../../store/spot";

const CreateANewSpotForm = () => {
    
    const dispatch = useDispatch();

    
    return (
        <h1> Create A New Spot Form</h1>
    )
}

export default CreateANewSpotForm;
