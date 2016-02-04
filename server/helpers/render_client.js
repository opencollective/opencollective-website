// For JSX
const React = require('react');

const renderToString = require('react-dom/server').renderToString;
const Provider = require('react-redux').Provider;

const createStore = require('../../store/create');
const PublicGroup = require('../../containers/PublicGroup').default;

module.exports = (initialState) => {
  const store = createStore(initialState);

  // Render the PublicGroup Container to a string
  return renderToString(
    <Provider store={store}>
      <PublicGroup />
    </Provider>
  );
}

