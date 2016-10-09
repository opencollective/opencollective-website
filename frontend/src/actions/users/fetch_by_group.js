import { get } from '../../lib/api';
import * as constants from '../../constants/users';

/**
 * Fetch users from a group
 */
export default (slug) => {
  return dispatch => {
    dispatch(request(slug));
    return get(`/groups/${slug}/users`)
    .then(json => dispatch(success(slug, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(slug) {
  return {
    type: constants.FETCH_USERS_BY_GROUP_REQUEST,
    slug
  };
}

function success(slug, json) {
  return {
    type: constants.FETCH_USERS_BY_GROUP_SUCCESS,
    slug,
    users: json
  };
}

function failure(error) {
  return {
    type: constants.FETCH_USERS_BY_GROUP_FAILURE,
    error,
  };
}
