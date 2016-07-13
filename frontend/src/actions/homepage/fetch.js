import { get } from '../../lib/api';
import * as constants from '../../constants/homepage';

/**
 * Fetch one group
 */

export default () => {
  return dispatch => {
    dispatch(request());

    return get('/homepage')
    .then(json => dispatch(success(json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request() {
  return {
    type: constants.HOMEPAGE_REQUEST
  };
}

export function success(json) {
  return {
    type: constants.HOMEPAGE_SUCCESS,
    json
  };
}

function failure(id, error) {
  return {
    type: constants.HOMEPAGE_FAILURE,
    error
  };
}
