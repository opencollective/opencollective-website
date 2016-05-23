import { getThirdParty } from '../../lib/api';
import * as constants from '../../constants/github';


/**
 * Fetch a user's repo
 */

export default (owner, repo) => {
  return dispatch => {
    dispatch(request(owner, repo));

    return getThirdParty(`https://api.github.com/repos/${owner}/${repo}/contributors`)
    .then(json => {
      if (json.length >= constants.MIN_CONTRIBUTORS_FOR_ONBOARDING) {
        dispatch(success(owner, repo, json));
      } else {
        throw new Error(`The repository ${repo}, does not have ${constants.MIN_CONTRIBUTORS_FOR_ONBOARDING} or more contributors`);
      }
    })
    .catch((error) => {
      dispatch(failure(owner, repo, error));
      throw error;
    });
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
