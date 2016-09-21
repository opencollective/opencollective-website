import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

const options = {};

if (process.env.NODE_ENV === 'production') {
  // Only show failure on production
  options.predicate = (getState, action) => {
    return `${action.type}`.match(/FAILURE/)
  };
}

const logger = createLogger(options);

const middleware = [logger, thunk];

export default middleware;
