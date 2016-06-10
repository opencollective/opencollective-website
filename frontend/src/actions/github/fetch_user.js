import { getThirdParty } from '../../lib/api';
import * as constants from '../../constants/github';


/**
 * Fetch a user's public info
 */

export default (owner) => {
  return dispatch => {
    dispatch(request(owner));

    return getThirdParty(`https://api.github.com/users/${owner}`)
    .then(json => {
      dispatch(success(owner, json));
    })
    .catch((error) => {
      dispatch(failure(owner, error));
      throw error;
    });
  }
};

function request(owner) {
  return {
    type: constants.GET_USER_FROM_GITHUB_REQUEST,
    owner
  };
}

export function success(owner, json) {
  return {
    type: constants.GET_USER_FROM_GITHUB_SUCCESS,
    owner,
    json
  };
}

function failure(owner, error) {
  return {
    type: constants.GET_USER_FROM_GITHUB_FAILURE,
    owner,
    error
  };
}
