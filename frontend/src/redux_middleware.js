import contains from 'lodash/collection/contains';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

const options = {};

if (process.env.NODE_ENV === 'production') {
  // Only show failure on production
  options.predicate = (getState, action) => {
    return contains(action.type, 'FAILURE');
  };
}
const logger = createLogger(options);

const middleware = [thunk, logger];

export default middleware;
