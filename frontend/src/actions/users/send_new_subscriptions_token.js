import { postJSON } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Send email with the new subscription token
 */

export default (email) => {
  return dispatch => {
    dispatch(request(email));

    return postJSON('/subscriptions/new_token', { email }, {})
    .then(() => dispatch(success(email)))
    .catch(err => {
      dispatch(failure(err, email));
      throw new Error(err.message);
    });
  };
};

function request(email) {
  return {
    type: constants.SEND_NEW_SUBSCRIPTIONS_TOKEN_REQUEST,
    email
  };
}

function success(email) {
  return {
    type: constants.SEND_NEW_SUBSCRIPTIONS_TOKEN_SUCCESS,
    email
  };
}

function failure(error, email) {
  return {
    type: constants.SEND_NEW_SUBSCRIPTIONS_TOKEN_FAILURE,
    error,
    email
  };
}
