
import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/users';

/**
 * Fetch all the groups from a user
 */

export default (userid) => {
  return dispatch => {
    dispatch(request(userid));
    return get(`users/${userid}/groups`, {
        schema: Schemas.GROUP_ARRAY,
        params: { include: 'usergroup.role' }
      })
      .then(json => dispatch(success(userid, json)))
      .catch(err => dispatch(failure(err)));
  };
};

function request(userid) {
  return {
    type: constants.USER_GROUPS_REQUEST,
    userid
  };
}

function success(userid, json) {
  return {
    type: constants.USER_GROUPS_SUCCESS,
    userid,
    groups: json.groups,
  };
}

function failure(error) {
  return {
    type: constants.USER_GROUPS_FAILURE,
    error,
  };
}
