import { get } from '../../lib/api';
import * as constants from '../../constants/donations';

const FETCH_DONATIONS_OPTIONS = {
  per_page: 3,
  sort: 'createdAt',
  donation: true,
  direction: 'desc'
};

/**
 * Fetch donations from a group
 */
export default (slug, params = FETCH_DONATIONS_OPTIONS) => {
  return dispatch => {
    dispatch(request(slug, params));
    return get(`/groups/${slug}/transactions`, {
      params
    })
    .then(json => dispatch(success(slug, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(slug, params) {
  return {
    type: constants.DONATIONS_REQUEST,
    slug,
    params
  };
}

export function success(slug, json) {
  return {
    type: constants.DONATIONS_SUCCESS,
    slug,
    donations: json,
  };
}

function failure(error) {
  return {
    type: constants.DONATIONS_FAILURE,
    error,
  };
}
