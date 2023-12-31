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

//? Delete a Review
const DELETE_SPOT_REVIEWS = "/spots/deleteSpotReviews"

const deleteSpotReviews = (spotId, reviewId) => ({
  type: DELETE_SPOT_REVIEWS,
  spotId,
  reviewId,
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

//? Delete a Spot Review
export const deleteSpotReviewThunk = (spotId, reviewId) => async (dispatch) => {
  const requestMethods = {
    method: "DELETE",
  }

  const res = await csrfFetch(`/api/reviews/${reviewId}`, requestMethods)

  if (res.ok) {
    const deletedReview = await res.json();
    dispatch(deleteSpotReviews(spotId, reviewId))
    return deletedReview
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
    case DELETE_SPOT_REVIEWS:
      const { spotId, reviewId } = action;
      const updatedReviews = state[spotId].filter(
        (review) => review.id !== reviewId
      );
      return {
        ...state,
        [spotId]: updatedReviews,
  };
    default:
      return state;
  }
};

export default reviewReducer;
