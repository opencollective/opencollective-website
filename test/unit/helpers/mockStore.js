import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];

/**
 * Creates a mock of Redux store with middleware.
 * Basically you pass the actions you expect and it will compared them
 * to the actual ones that get dispatched
 */

export default configureStore(middlewares);
