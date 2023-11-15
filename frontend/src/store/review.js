import { csrfFetch } from "./csrf";

//! Action Creators
//? Load Spot Review
const LOAD_SPOT_REVIEWS = '/spots/loadSpotReviews'

const loadSpotReviews = (spotId, reviews) => ({
    type: LOAD_SPOT_REVIEWS,
    spotId,
    reviews,
}); 

//? Post a Review
const POST_SPOT_REVIEWS = "/spots/postSpotReviews"

const postSpotReviews = (spotId, reviewData) => ({
  type: POST_SPOT_REVIEWS,
  spotId,
  reviewData,
})


//! Thunks
//? Load Spot Review
export const loadSpotReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  
    if (res.ok) {
      const data = await res.json();
      dispatch(loadSpotReviews(spotId, data))
      return data;
    }
    return res;
  };

//? Post a Review
export const postSpotReviewThunk = (spotId, reviewData) => async (dispatch) => {
  const requestMethods = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
  }
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, requestMethods)

  if (res.ok) {
    const newReview = await res.json();
    dispatch(postSpotReviews(spotId, newReview))
    return newReview;
  }
  return res;
}

//! Reducer
const initialState = {};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS:
        return {
            ...state,
            [action.spotId]: action.reviews.Reviews,
          };
    case POST_SPOT_REVIEWS: 
    return {
      ...state,
      [action.spotId]: [...state[action.spotId], action.reviewData],
    };
    default:
      return state;
  }
};

export default reviewReducer;
