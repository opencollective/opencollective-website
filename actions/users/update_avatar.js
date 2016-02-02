import { putJSON } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * update avatar for user
 */

export default (userid, avatar) => {
  const url = `users/${userid}/avatar`;

  return dispatch => {
    dispatch(request(userid, avatar));
    return putJSON(url, { avatar })
      .then(json => dispatch(success(userid, avatar, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(userid, avatar) {
  return {
    type: constants.UPDATE_AVATAR_REQUEST,
    avatar,
    userid
  };
}

function success(userid, avatar, json) {
  return {
    type: constants.UPDATE_AVATAR_SUCCESS,
    userid,
    avatar,
    json
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_AVATAR_FAILURE,
    error
  };
}
