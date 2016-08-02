import { post } from '../../lib/api';
import * as constants from '../../constants/subscriptions';

/**
 * Cancel a subscription
 */

export default (id) => {
  return dispatch => {
    dispatch(request(id));
    return post(`/subscriptions/${id}/cancel`)
    .then(() => dispatch(success(id)))
    .catch(error => {
      dispatch(failure(id, error));
      throw new Error(error.message);
    });
  };
};

function request(id) {
  return {
    type: constants.CANCEL_SUBSCRIPTION_REQUEST,
    id
  };
}

export function success(id) {
  return {
    type: constants.CANCEL_SUBSCRIPTION_SUCCESS,
    id
  };
}

function failure(id, error) {
  return {
    type: constants.CANCEL_SUBSCRIPTION_FAILURE,
    id,
    error
  };
}
