import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

import PublicGroup from './containers/PublicGroup';
import createStore from './store/create';

const store = createStore(window.__INITIAL_STATE__);

render(
  <Provider store={store}>
    <PublicGroup />
  </Provider>,
  document.querySelector('#content')
);
