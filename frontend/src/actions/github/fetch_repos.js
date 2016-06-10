import { get } from '../../lib/api';
import * as constants from '../../constants/github';


/**
 * Fetch a user's repo
 */

export default (username, token) => {
  return dispatch => {
    dispatch(request(username));
    return get(`/github-repositories`, {headers: { Authorization: `Bearer ${token}` }})
    .then(json => {
      json = json.filter((repo) => repo.stargazers_count >= constants.MIN_STARS_FOR_ONBOARDING);
      dispatch(success(username, json));
    })
    .catch((error) => {
      dispatch(failure(username, error));
      throw error;
    });
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
