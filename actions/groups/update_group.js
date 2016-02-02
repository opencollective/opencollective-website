import { putJSON } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * update group information
 */

export default (groupid, group) => {
  const url = `groups/${groupid}`;

  return dispatch => {
    dispatch(request(groupid, group));
    return putJSON(url, { group })
      .then(json => dispatch(success(groupid, group, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(groupid, attributes) {
  return {
    type: constants.UPDATE_GROUP_REQUEST,
    attributes,
    groupid
  };
}

function success(groupid, attributes, json) {
  return {
    type: constants.UPDATE_GROUP_SUCCESS,
    groupid,
    attributes,
    json
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_GROUP_FAILURE,
    error
  };
}
