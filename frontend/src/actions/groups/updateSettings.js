import { putJSON } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * Update group settings
 */

export default (groupid, group) => {
  const url = `/groups/${groupid}/settings`;

  return dispatch => {
    dispatch(request(groupid, group));
    return putJSON(url, {group})
      .then(json => dispatch(success(groupid, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(groupid, group) {
  return {
    type: constants.UPDATE_GROUP_REQUEST,
    groupid,
    group
  };
}

function success(groupid, group) {
  return {
    type: constants.UPDATE_GROUP_SUCCESS,
    groupid,
    group
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_GROUP_FAILURE,
    error
  };
}
