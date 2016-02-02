import { postJSON } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * update avatar for user
 */

export default (email) => {
  return dispatch => {
    dispatch(request(email));
    return postJSON('users/password/forgot', { email })
      .then(json => dispatch(success(email, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(email) {
  return {
    type: constants.SEND_RESET_PASSWORD_LINK_REQUEST,
    email
  };
}

function success(email, json) {
  return {
    type: constants.SEND_RESET_PASSWORD_LINK_SUCCESS,
    email,
    json
  };
}

function failure(error) {
  return {
    type: constants.SEND_RESET_PASSWORD_LINK_FAILURE,
    error
  };
}
