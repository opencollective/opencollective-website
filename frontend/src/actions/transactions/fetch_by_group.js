import { get } from '../../lib/api';
import Schemas from '../../lib/schemas';
import * as constants from '../../constants/transactions';

/**
 * Fetch multiple transactions in a group
 */

export default (groupid, options={}) => {
  return dispatch => {
    dispatch(request(groupid));
    return get(`/groups/${groupid}/transactions`, {
      schema: Schemas.TRANSACTION_ARRAY,
      params: options || {}
    })
    .then(json => dispatch(success(groupid, json)))
    .catch(error => dispatch(failure(error)));
  };
};

function request(groupid) {
  return {
    type: constants.TRANSACTIONS_REQUEST,
    groupid
  };
}

function success(groupid, json) {
  return {
    type: constants.TRANSACTIONS_SUCCESS,
    groupid,
    transactions: json.transactions,
  };
}

function failure(error) {
  return {
    type: constants.TRANSACTIONS_FAILURE,
    error,
  };
}
