import { get } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Fetch multiple users in a group
 */

export default (groupid) => {
  return dispatch => {
    dispatch(request(groupid));
    return get(`/groups/${groupid}/users`)
    .then(json => dispatch(success(groupid, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(groupid) {
  return {
    type: constants.FETCH_USERS_BY_GROUP_REQUEST,
    groupid
  };
}

function success(groupid, json) {
  return {
    type: constants.FETCH_USERS_BY_GROUP_SUCCESS,
    groupid,
    users: json
  };
}

function failure(error) {
  return {
    type: constants.FETCH_USERS_BY_GROUP_FAILURE,
    error,
  };
}
