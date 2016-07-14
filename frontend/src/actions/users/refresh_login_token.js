import { post } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Send email with the new login token
 */

export default (token) => {
  return dispatch => {
    dispatch(request(token));

    return post('/users/refresh_login_token', {}, {
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
    type: constants.REFRESH_LOGIN_TOKEN_REQUEST,
    token
  };
}

function success(token) {
  return {
    type: constants.REFRESH_LOGIN_TOKEN_SUCCESS,
    token
  };
}

function failure(error, token) {
  return {
    type: constants.REFRESH_LOGIN_TOKEN_FAILURE,
    error,
    token
  };
}
