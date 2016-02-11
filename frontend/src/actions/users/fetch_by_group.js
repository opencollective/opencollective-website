import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/users';

/**
 * Fetch multiple users in a group
 */

export default (groupid) => {
  return dispatch => {
    dispatch(request(groupid));
    return get(`/groups/${groupid}/users`, {
      schema: Schemas.USER_ARRAY
    })
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

function success(groupid, {users}) {
  return {
    type: constants.FETCH_USERS_BY_GROUP_SUCCESS,
    groupid,
    users
  };
}

function failure(error) {
  return {
    type: constants.FETCH_USERS_BY_GROUP_FAILURE,
    error,
  };
}
