import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/donations';

const FETCH_DONATIONS_OPTIONS = {
  per_page: 3,
  sort: 'createdAt',
  direction: 'desc'
};

/**
 * Fetch donations from a group
 */
export default (slug, params = FETCH_DONATIONS_OPTIONS) => {
  return dispatch => {
    dispatch(request(slug, params));
    return get(`/groups/${slug}/donations`, {
      schema: Schemas.DONATION_ARRAY,
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
    donations: json.donations,
  };
}

function failure(error) {
  return {
    type: constants.DONATIONS_FAILURE,
    error,
  };
}
