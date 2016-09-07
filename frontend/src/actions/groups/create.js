import { postJSON } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * update user
 */

export default (group) => {
  const url = `/groups`;
  return dispatch => {
    dispatch(request(group));
    return postJSON(url, { group })
      .then(json => dispatch(success(group, json)))
      .catch(err => {
        dispatch(failure(err));
        throw new Error(err.message);
      });
  };
};

function request(group) {
  return {
    type: constants.CREATE_GROUP_REQUEST,
    group,
  };
}

function success(group, json) {
  return {
    type: constants.CREATE_GROUP_SUCCESS,
    group,
    json
  };
}

function failure(error) {
  return {
    type: constants.CREATE_GROUP_FAILURE,
    error
  };
}
