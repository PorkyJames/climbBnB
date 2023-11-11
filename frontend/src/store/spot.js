//! Imports
//! Don't need to import useDispatch because redux automatically does it for you!

//! Import csrfFetch to fetch all of our APIs after authentication
import { csrfFetch } from "./csrf";

// * Action Creators
//! All Spots
const LOAD_ALL_SPOTS = "/spots/loadAllSpots"

const loadAllSpots = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        spots,
    }
}

//! Details of a Spot
const LOAD_SPOT_DETAILS = "/spots/loadSpotDetails"

const loadSpotDetails = (spot) => {
    return {
        type: LOAD_SPOT_DETAILS,
        spot,
    }
}

// //! Reviews of a Spot

// const LOAD_SPOT_REVIEWS = "/spots/loadSpotReviews"

// const loadSpotReviews = (review) => {
//     return {
//         type: LOAD_SPOT_REVIEWS,
//         review,
//     }
// }

//! Create a new Spot
const CREATE_NEW_SPOT = "/spots/createNewSpot"

const createNewSpot = (spot) => {
    return {
        type: CREATE_NEW_SPOT,
        spot,
    }
}

// * Thunks
//! All Spots
export const loadAllSpotsThunk = () => async dispatch => {
    const res = await csrfFetch("/api/spots")

    if (res.ok) {
        const data = await res.json();
        dispatch(loadAllSpots(data))
        return data
    }
    return res;
}

//! Details of a Spot
export const loadSpotDetailsThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`)

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSpotDetails(data))
        return data
    }
    return res;
}

//! Create a New Spot
export const createNewSpotThunk = (dataFromForm) => async dispatch => {
    const requestMethods = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFromForm)
    }

    console.log(dataFromForm)

    const res = await csrfFetch("/api/spots", requestMethods)

    if (res.ok) {
        const createdSpot = await res.json();
        dispatch(createNewSpot(createdSpot));
        return createdSpot;
    } 
}

// //! Spot Details Reviews
// export const loadSpotReviewsThunk = (spotId) => async dispatch => {
//     const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

//     if (res.ok) {
//         const data = await res.json();
//         dispatch(loadSpotReviews(data))
//         return data;
//     }
//     return res;
// }

//! Our reducer for spots

const initialState = {};

export const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_SPOTS: {
            const newState = {...state};
            action.spots.Spots.forEach((spot) => {
                if (!newState[spot.id]) {
                    newState[spot.id] = spot
                } 
            })
            return newState; 
        }
        case LOAD_SPOT_DETAILS: {
            const newState = {};
            newState[action.spot.id] = action.spot;
            return newState;
        }
        case CREATE_NEW_SPOT: {
            return {
                ...state,
                [action.spot.id]: action.spot
            }
        }
        default:
            return state;
    }
    
}
