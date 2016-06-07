import { postJSON } from '../../lib/api';
import * as constants from '../../constants/transactions';

/**
 * Create an expense
 */

export default (groupid, expense) => {
  const url = `/groups/${groupid}/expenses/`;

  return dispatch => {
    dispatch(request(groupid, expense));
    return postJSON(url, {expense})
      .then(json => dispatch(success(groupid, json)))
      .catch(error => {
        dispatch(failure(error))
        throw new Error(error.message);
      });
  };
};

function request(groupid, expense) {
  return {
    type: constants.CREATE_TRANSACTION_REQUEST,
    groupid,
    expense
  };
}

function success(groupid, expense) {
  const expenses = {
    [expense.id]: expense
  };

  return {
    type: constants.CREATE_TRANSACTION_SUCCESS,
    groupid,
    expenses
  };
}

function failure(error) {
  return {
    type: constants.CREATE_TRANSACTION_FAILURE,
    error,
  };
}
