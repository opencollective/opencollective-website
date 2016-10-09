import { get } from '../../lib/api';
import * as constants from '../../constants/expenses';

const FETCH_EXPENSES_OPTIONS = {
  per_page: 3,
  sort: 'incurredAt',
  direction: 'desc',
  exclude: 'fees'
};

/**
 * Fetch expenses from a group
 */
export default (slug) => {
  return dispatch => {
    dispatch(request(slug));
    return get(`/groups/${slug}/expenses`, {
      params: FETCH_EXPENSES_OPTIONS
    })
    .then(json => dispatch(success(slug, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(slug) {
  return {
    type: constants.EXPENSES_REQUEST,
    slug
  };
}

export function success(slug, json) {
  return {
    type: constants.EXPENSES_SUCCESS,
    slug,
    expenses: json,
  };
}

function failure(error) {
  return {
    type: constants.EXPENSES_FAILURE,
    error,
  };
}
