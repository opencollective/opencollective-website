import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import PublicGroup from './containers/PublicGroup';
import createStore from './store/create';

const initialState = window.__INITIAL_STATE__ || {};
const store = createStore(initialState);

render(
  <Provider store={store}>
    <PublicGroup />
  </Provider>,
  document.querySelector('#content')
);
