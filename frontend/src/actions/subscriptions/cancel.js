import { post } from '../../lib/api';
import * as constants from '../../constants/subscriptions';

/**
 * Cancel a subscription
 */

export default (id, token) => {
  return dispatch => {
    dispatch(request(id, token));
    return post(`/subscriptions/${id}/cancel`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => dispatch(success(id, token)))
    .catch(error => dispatch(failure(id, token, error)));
  };
};

function request(id, token) {
  return {
    type: constants.CANCEL_SUBSCRIPTION_REQUEST,
    id,
    token
  };
}

export function success(id, token) {
  return {
    type: constants.CANCEL_SUBSCRIPTION_SUCCESS,
    id,
    token
  };
}

function failure(id, token, error) {
  return {
    type: constants.CANCEL_SUBSCRIPTION_FAILURE,
    id,
    token,
    error
  };
}
