import { get } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Fetch one user by username
 */

export default (username, options) => {
  return dispatch => {
    dispatch(request(username, options));
    return get(`/users/${username}`, { params: options })
    .then(json => dispatch(success(username, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(username, options) {
  return {
    type: constants.FETCH_USER_BY_USERNAME_REQUEST,
    username,
    options
  };
}

function success(username, json) {
  return {
    type: constants.FETCH_USER_BY_USERNAME_SUCCESS,
    username,
    users: json
  };
}

function failure(error) {
  return {
    type: constants.FETCH_USER_BY_USERNAME_FAILURE,
    error,
  };
}
