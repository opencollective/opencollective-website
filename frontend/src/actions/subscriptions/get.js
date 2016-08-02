import { get } from '../../lib/api';
import * as constants from '../../constants/subscriptions';

/**
 * Fetch subscriptions for a user
 */

export default () => {
  return dispatch => {
    dispatch(request());
    return get(`/subscriptions`)
    .then(json => dispatch(success(json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request() {
  return {
    type: constants.GET_SUBSCRIPTIONS_REQUEST,
  };
}

function success(json) {
  return {
    type: constants.GET_SUBSCRIPTIONS_SUCCESS,
    subscriptions: json
  };
}

function failure(error) {
  return {
    type: constants.GET_SUBSCRIPTIONS_FAILURE,
    error
  };
}
