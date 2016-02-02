import { putJSON } from '../../lib/api';
import * as constants from '../../constants/transactions';

/**
 * Update a transaction in a group
 */

export default (groupid, transactionid, transaction) => {
  const url = `groups/${groupid}/transactions/${transactionid}`;

  return dispatch => {
    dispatch(request(groupid, transaction));
    return putJSON(url, {transaction})
      .then(json => dispatch(success(groupid, json)))
      .catch(error => {
        dispatch(failure(error))
        throw new Error(error.message);
      });
  };
};

function request(groupid, transaction) {
  return {
    type: constants.UPDATE_TRANSACTION_REQUEST,
    groupid,
    transaction
  };
}

function success(groupid, transaction) {
  const transactions = {
    [transaction.id]: transaction
  };

  return {
    type: constants.UPDATE_TRANSACTION_SUCCESS,
    groupid,
    transactions,
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_TRANSACTION_FAILURE,
    error,
  };
}
