import { putJSON } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * update user
 */

export default (userid, attributes) => {
  const url = `/users/${userid}/avatars`;
  return dispatch => {
    dispatch(request(userid, attributes));
    return putJSON(url, { "userData": attributes })
      .then(json => dispatch(success(userid, attributes, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(userid, attributes) {
  return {
    type: constants.UPDATE_USER_REQUEST,
    attributes,
    userid
  };
}

function success(userid, attributes, json) {
  return {
    type: constants.UPDATE_USER_SUCCESS,
    userid,
    attributes,
    json
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_USER_FAILURE,
    error
  };
}
