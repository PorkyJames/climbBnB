import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';

import configureStore from './store';

//! Create a variable to access your store and expose it to window

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
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
