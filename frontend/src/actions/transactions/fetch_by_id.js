import { get } from '../../lib/api';
import * as constants from '../../constants/transactions';

/**
 * Fetch one transaction in a group
 */
export default (slug, transactionid) => {
  return dispatch => {
    dispatch(request(slug, transactionid));

    return get(`/groups/${slug}/transactions/${transactionid}`)
    .then(json => dispatch(success(slug, transactionid, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(slug, transactionid) {
  return {
    type: constants.TRANSACTION_REQUEST,
    slug,
    transactionid
  };
}

function success(slug, transactionid, json) {
  return {
    type: constants.TRANSACTION_SUCCESS,
    slug,
    transactionid,
    transactions: json,
  };
}

function failure(error) {
  return {
    type: constants.TRANSACTION_FAILURE,
    error,
  };
}
