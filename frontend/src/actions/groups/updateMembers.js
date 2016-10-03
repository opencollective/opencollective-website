import { putJSON } from '../../lib/api';
import * as constants from '../../constants/groups';

/**
 * Update group members
 */
export default (slug, group) => {
  const url = `/groups/${slug}/members`;

  return dispatch => {
    dispatch(request(slug, group));
    return putJSON(url, {group})
      .then(json => dispatch(success(slug, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(slug, group) {
  return {
    type: constants.UPDATE_GROUP_MEMBERS_REQUEST,
    slug,
    group
  };
}

function success(slug, group) {
  return {
    type: constants.UPDATE_GROUP_MEMBERS_SUCCESS,
    slug,
    group
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_GROUP_MEMBERS_FAILURE,
    error
  };
}
