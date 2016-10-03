import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/groups';

/**
 * Fetch one group
 */

export default (slug) => {
  return dispatch => {
    dispatch(request(slug));

    return get(`/groups/${slug}`, { schema: Schemas.GROUP })
    .then(json => dispatch(success(slug, json)))
    .catch(error => dispatch(failure(slug, error)));
  };
};

function request(slug) {
  return {
    type: constants.GROUP_REQUEST,
    slug
  };
}

export function success(slug, json) {
  return {
    type: constants.GROUP_SUCCESS,
    slug,
    groups: json.groups
  };
}

function failure(slug, error) {
  return {
    type: constants.GROUP_FAILURE,
    slug,
    error
  };
}
