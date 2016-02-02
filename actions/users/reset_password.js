import { postJSON } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Reset password
 */

export default (userToken, resetToken, password) => {
  return dispatch => {
    dispatch(request(userToken, resetToken, password));
    return postJSON(`users/password/reset/${userToken}/${resetToken}`, {
      password,
      passwordConfirmation: password
    })
    .then(json => dispatch(success(userToken, resetToken, password, json)))
    .catch(err => {
      dispatch(failure(userToken, resetToken, password, err));
      throw new Error(err.message);
    });
  };
};

function request(userToken, resetToken, password) {
  return {
    type: constants.RESET_PASSWORD_REQUEST,
    userToken,
    resetToken,
    password
  };
}

function success(userToken, resetToken, password, json) {
  return {
    type: constants.RESET_PASSWORD_SUCCESS,
    userToken,
    resetToken,
    password,
    json
  };
}

function failure(userToken, resetToken, password, error) {
  return {
    type: constants.RESET_PASSWORD_FAILURE,
    userToken,
    resetToken,
    password,
    error
  };
}
