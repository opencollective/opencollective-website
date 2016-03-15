import { get } from '../../lib/api';
import * as constants from '../../constants/subscriptions';

/**
 * Fetch subscriptions for a user
 */

export default (token) => {
  return dispatch => {
    dispatch(request(token));
    return get(`/subscriptions`)
    .then(json => dispatch(success(token, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(token) {
  return {
    type: constants.GET_SUBSCRIPTIONS_REQUEST,
    token
  };
}

function success(token, json) {
  return {
    type: constants.GET_SUBSCRIPTIONS_SUCCESS,
    token,
    subscriptions: json
  };
}

function failure(error) {
  return {
    type: constants.GET_SUBSCRIPTIONS_FAILURE,
    error,
  };
}
