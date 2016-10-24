import { get } from '../../lib/api';
import * as constants from '../../constants/transactions';

/**
 * Fetch transactions for a collective
 */
export default (slug, options={}) => {
  return dispatch => {
    dispatch(request(slug, options));
    return get(`/groups/${slug}/transactions`, {
      params: options || {}
    })
    .then(json => dispatch(success(slug, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(slug, options) {
  return {
    type: constants.TRANSACTIONS_REQUEST,
    options,
    slug
  };
}

export function success(slug, json) {
  return {
    type: constants.TRANSACTIONS_SUCCESS,
    slug,
    transactions: json,
  };
}

function failure(error) {
  return {
    type: constants.TRANSACTIONS_FAILURE,
    error,
  };
}
