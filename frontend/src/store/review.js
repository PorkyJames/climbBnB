import { csrfFetch } from "./csrf";

//! Action Creators
const LOAD_SPOT_REVIEWS = '/spots/loadSpotReviews'

const loadSpotReviews = (spotId, reviews) => ({
    type: LOAD_SPOT_REVIEWS,
    spotId,
    reviews,
}); 

//! Thunks
export const loadSpotReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  
    if (res.ok) {
      const data = await res.json();
      dispatch(loadSpotReviews(spotId, data))
      return data;
    }
    return res;
  };

//! Reducer
const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS:
        return {
            ...state,
            [action.spotId]: action.reviews,
          };
    default:
      return state;
  }
};

export default reviewReducer;
