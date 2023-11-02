import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import * as sessionActions from "./store/session";

import { restoreCSRF, csrfFetch } from './store/csrf';

import configureStore from './store';

//! Create a variable to access your store and expose it to window

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {

  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

function Root () {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
