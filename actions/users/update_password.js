import { putJSON } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * update passowrd for user
 */

export default (userid, password, passwordConfirmation) => {
  const url = `users/${userid}/password`;

  return dispatch => {
    dispatch(request(userid));
    return putJSON(url, { password, passwordConfirmation })
      .then(json => dispatch(success(userid, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(userid) {
  return {
    type: constants.UPDATE_PASSWORD_REQUEST,
    userid
  };
}

function success(userid, json) {
  return {
    type: constants.UPDATE_PASSWORD_SUCCESS,
    userid,
    json
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_PASSWORD_FAILURE,
    error
  };
}
