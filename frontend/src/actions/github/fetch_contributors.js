import { getThirdParty } from '../../lib/api';
import * as constants from '../../constants/github';


/**
 * Fetch a user's repo
 */

export default (owner, repo) => {
  return dispatch => {
    dispatch(request(owner, repo));

    return getThirdParty(`https://api.github.com/repos/${owner}/${repo}/contributors`)
    .then(json => dispatch(success(owner, repo, json)))
    .catch(error => dispatch(failure(owner, repo, error)));
  }
};

function request(owner, repo) {
  return {
    type: constants.GET_CONTRIBUTORS_FROM_GITHUB_REQUEST,
    owner,
    repo
  };
}

export function success(owner, repo, json) {
  return {
    type: constants.GET_CONTRIBUTORS_FROM_GITHUB_SUCCESS,
    owner,
    repo,
    json
  };
}

function failure(owner, repo, error) {
  return {
    type: constants.GET_CONTRIBUTORS_FROM_GITHUB_FAILURE,
    owner,
    repo,
    error
  };
}
