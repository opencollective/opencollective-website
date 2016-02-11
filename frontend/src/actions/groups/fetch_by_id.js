import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/groups';

/**
 * Fetch one group
 */

export default (id) => {
  return dispatch => {
    dispatch(request(id));

    return get(`/groups/${id}`, { schema: Schemas.GROUP })
    .then(json => dispatch(success(id, json)))
    .catch(error => dispatch(failure(id, error)));
  };
};

function request(id) {
  return {
    type: constants.GROUP_REQUEST,
    id
  };
}

function success(id, json) {
  return {
    type: constants.GROUP_SUCCESS,
    id,
    groups: json.groups
  };
}

function failure(id, error) {
  return {
    type: constants.GROUP_FAILURE,
    id,
    error
  };
}
