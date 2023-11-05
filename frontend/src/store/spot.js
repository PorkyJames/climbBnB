//! Imports
//! Don't need to import useDispatch because redux automatically does it for you!

//! Import csrfFetch to fetch all of our APIs after authentication
import { csrfFetch } from "./csrf";

//! Action Creator for getting all Spots
const LOAD_ALL_SPOTS = "/spots/loadAllSpots"

const loadAllSpots = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        spots,
    }
}

//! Thunk for loading All Spots
export const loadAllSpotsThunk = () => async dispatch => {
    const res = await csrfFetch("/api/spots")

    if (res.ok) {
        const data = await res.json();
        dispatch(loadAllSpots(data))
        return data
    }
    return res;
}

//! Our reducer for spots

const initialState = {};

export const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot;
            })
            return newState;
        }
        default:
            return state;
    }
    
}
