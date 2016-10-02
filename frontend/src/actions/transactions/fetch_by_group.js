import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/transactions';

/**
 * Fetch transactions from a group
 */
export default (slug, options={}) => {
  return dispatch => {
    dispatch(request(slug));
    const endpoint = options.donation ? 'transactions' : 'expenses';
    return get(`/groups/${slug}/${endpoint}`, {
      schema: Schemas.TRANSACTION_ARRAY,
      params: options || {}
    })
    .then(json => dispatch(success(slug, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(slug) {
  return {
    type: constants.TRANSACTIONS_REQUEST,
    slug
  };
}

export function success(slug, json) {
  return {
    type: constants.TRANSACTIONS_SUCCESS,
    slug,
    transactions: json.transactions,
  };
}

function failure(error) {
  return {
    type: constants.TRANSACTIONS_FAILURE,
    error,
  };
}
