// For JSX
import React from 'react';

import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux'

import Root from '../../frontend/src/client';

export default (initialState) => {
  const store = createStore(initialState);

  // Render the PublicGroup Container to a string
  return renderToString(<Root />);
}

