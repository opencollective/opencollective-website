import { get } from '../../lib/api';
import * as constants from '../../constants/transactions';

/**
 * Fetch one transaction in a group
 */
export default (slug, transactionuuid) => {
  return dispatch => {
    dispatch(request(slug, transactionuuid));

    return get(`/groups/${slug}/transactions/${transactionuuid}`)
    .then(json => dispatch(success(slug, transactionuuid, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(slug, transactionuuid) {
  return {
    type: constants.TRANSACTION_REQUEST,
    slug,
    transactionuuid
  };
}

function success(slug, transactionuuid, json) {
  return {
    type: constants.TRANSACTION_SUCCESS,
    slug,
    transactionuuid,
    transactions: json,
  };
}

function failure(error) {
  return {
    type: constants.TRANSACTION_FAILURE,
    error,
  };
}
