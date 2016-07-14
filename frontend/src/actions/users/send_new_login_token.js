import { postJSON } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Send email with the new login token
 */

export default (email, redirect) => {
  return dispatch => {
    dispatch(request(email, redirect));

    return postJSON('/users/new_login_token', { email, redirect }, {})
    .then(() => dispatch(success(email, redirect)))
    .catch(err => {
      dispatch(failure(err, email, redirect));
      throw new Error(err.message);
    });
  };
};

function request(email, redirect) {
  return {
    type: constants.SEND_NEW_LOGIN_TOKEN_REQUEST,
    email,
    redirect
  };
}

function success(email, redirect) {
  return {
    type: constants.SEND_NEW_LOGIN_TOKEN_SUCCESS,
    email,
    redirect
  };
}

function failure(error, email, redirect) {
  return {
    type: constants.SEND_NEW_LOGIN_TOKEN_FAILURE,
    error,
    email,
    redirect
  };
}
