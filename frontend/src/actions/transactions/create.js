import { postJSON } from '../../lib/api';
import * as constants from '../../constants/transactions';

/**
 * Create a new transaction in a group
 */

export default (groupid, transaction) => {
  const url = `/groups/${groupid}/transactions/`;

  return dispatch => {
    dispatch(request(groupid, transaction));
    return postJSON(url, {transaction})
      .then(json => dispatch(success(groupid, json)))
      .catch(error => {
        dispatch(failure(error))
        throw new Error(error.message);
      });
  };
};

function request(groupid, transaction) {
  return {
    type: constants.CREATE_TRANSACTION_REQUEST,
    groupid,
    transaction
  };
}

function success(groupid, transaction) {
  const transactions = {
    [transaction.id]: transaction
  };

  return {
    type: constants.CREATE_TRANSACTION_SUCCESS,
    groupid,
    transactions,
  };
}

function failure(error) {
  return {
    type: constants.CREATE_TRANSACTION_FAILURE,
    error,
  };
}
