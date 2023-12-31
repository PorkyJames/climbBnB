import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

//! Our reducers imported
import sessionReducer from './session';
import { spotsReducer } from './spot';
import reviewReducer from './review';

//! Reducer that will be combined and used together cause it only takes one reducer.
const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  reviews: reviewReducer,
})

//! Classic boilerplate code
let enhancer;

if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
  } else {
    const logger = require('redux-logger').default;
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
  }

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
}

//! Configure Store will allow us to attach the Redux store to our React application

export default configureStore;

