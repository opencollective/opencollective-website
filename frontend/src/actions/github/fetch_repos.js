import { getThirdParty } from '../../lib/api';
import * as constants from '../../constants/github';


/**
 * Fetch a user's repo
 */

export default (username) => {
  return dispatch => {
    dispatch(request(username));

    return getThirdParty(`https://api.github.com/users/${username}/repos`, {params: {type: 'owner'}})
    .then(json => dispatch(success(username, json)))
    .catch(error => dispatch(failure(username, error)));
  }
};

function request(username) {
  return {
    type: constants.GET_REPOS_FROM_GITHUB_REQUEST,
    username
  };
}

export function success(username, json) {
  return {
    type: constants.GET_REPOS_FROM_GITHUB_SUCCESS,
    username,
    json
  };
}

function failure(username, error) {
  return {
    type: constants.GET_REPOS_FROM_GITHUB_FAILURE,
    username,
    error
  };
}
