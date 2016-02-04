// For JSX
import React from 'react';

import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import createStore from '../../store/create';
import PublicGroup from '../../containers/PublicGroup';

export default (initialState) => {
  const store = createStore(initialState);

  // Render the PublicGroup Container to a string
  return renderToString(
    <Provider store={store}>
      <PublicGroup />
    </Provider>
  );
}

