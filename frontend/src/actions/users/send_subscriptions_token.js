import { post } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Send email with the new subscription token
 */

export default (token) => {
  return dispatch => {
    dispatch(request(token));

    return post('/subscriptions/token', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => dispatch(success(token)))
    .catch(err => {
      dispatch(failure(err, token));
      throw new Error(err.message);
    });
  };
};

function request(token) {
  return {
    type: constants.SEND_SUBSCRIPTIONS_TOKEN_REQUEST,
    token
  };
}

function success(token) {
  return {
    type: constants.SEND_SUBSCRIPTIONS_TOKEN_SUCCESS,
    token
  };
}

function failure(error, token) {
  return {
    type: constants.SEND_SUBSCRIPTIONS_TOKEN_FAILURE,
    error,
    token
  };
}
