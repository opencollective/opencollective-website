import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/groups';

/**
 * Fetch one group
 */

export default () => {
  return dispatch => {
    dispatch(request());

    return get('/leaderboard')
    .then(json => dispatch(success(json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request() {
  return {
    type: constants.GET_LEADERBOARD_REQUEST,
  };
}

export function success(json) {
  return {
    type: constants.GET_LEADERBOARD_SUCCESS,
    json
  };
}

function failure(error) {
  return {
    type: constants.GET_LEADERBOARD_FAILURE,
    error
  };
}
