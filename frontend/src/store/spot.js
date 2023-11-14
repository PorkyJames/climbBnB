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


//! Current spot of Logged in User
const LOAD_USER_SPOTS = '/spots/loadUserSpots'

const loadUserSpots = (spot) => {
    return {
        type: LOAD_USER_SPOTS,
        spot,
    }
}

//! Update a spot of Logged In User
const UPDATE_USER_SPOT = '/spots/updateUserSpot'

const updateUserSpot = (spot) => {
    return {
        type: UPDATE_USER_SPOT,
        spot,
    }
}

//! Delete a spot of the Logged in User
const DELETE_USER_SPOT = '/spots/deleteUserSpot'

const deleteUserSpot = (spotId) => {
    return {
        type: DELETE_USER_SPOT,
        spotId,
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

//! Get User Spots
export const loadUserSpotsThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/current`)

    if (res.ok) {
        const data = await res.json();
        dispatch(loadUserSpots(data))
        return data;
    }
}

//! Update A User Spot
export const updateUserSpotThunk = (spotId, spotDataFromForm) => async dispatch => {
    const requestMethods = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(spotDataFromForm)
    }
    
    const res = await csrfFetch(`/api/spots/${spotId}`, requestMethods)

    if (res.ok) {
        const updatedSpot = await res.json();
        dispatch(updateUserSpot(updatedSpot));
        return updatedSpot;
    }
}

//! Delete User Spot
export const deleteUserSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    })

    if (res.ok) {
        dispatch(deleteUserSpot(spotId));
        return spotId;
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
        case LOAD_USER_SPOTS: {
            const newState = { ...state };
            action.spot.Spots.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        case UPDATE_USER_SPOT: {
            const updatedSpot = action.spot;
            return {
              ...state,
              [updatedSpot.id]: updatedSpot,
            };
        }
        case DELETE_USER_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        default:
            return state;
    }
    
}
