import { postJSON } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * update user
 */

export default (payload, token) => {
  const url = `/groups`;
  return dispatch => {
    dispatch(request(payload));
    return postJSON(url, { payload }, {headers: {
      Authorization: `Bearer ${token}`,
      flow: 'github'
    }})
      .then(json => dispatch(success(payload, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(payload) {
  return {
    type: constants.CREATE_GROUP_FROM_GITHUB_REPO_REQUEST,
    payload,
  };
}

function success(payload, json) {
  return {
    type: constants.CREATE_GROUP_FROM_GITHUB_REPO_SUCCESS,
    payload,
    json
  };
}

function failure(error) {
  return {
    type: constants.CREATE_GROUP_FROM_GITHUB_REPO_FAILURE,
    error
  };
}
