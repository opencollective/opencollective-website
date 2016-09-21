import React from 'react';
import ReactDOM from 'react-dom';
import { ReduxRouter } from 'redux-router';
import { Provider } from 'react-redux';

export default (store, mountNode) => {
  const rootComponent = (
    <Provider store={store} key='provider'>
      <ReduxRouter/>
    </Provider>
  );

  return ReactDOM.render(rootComponent, mountNode, store.didInitialRender);
}
