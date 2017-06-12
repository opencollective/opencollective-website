import { putJSON } from '../../lib/api';
import * as constants from '../../constants/expenses';

/**
 * Update an expense in a group
 */

export default (groupid, expenseid, expense) => {
  const url = `/groups/${groupid}/expenses/${expenseid}`;

  return dispatch => {
    dispatch(request(groupid, expense));
    return putJSON(url, {expense})
      .then(json => dispatch(success(groupid, json)))
      .catch(error => {
        dispatch(failure(error))
        throw new Error(error.message);
      });
  };
};

function request(groupid, expense) {
  return {
    type: constants.UPDATE_EXPENSE_REQUEST,
    groupid,
    expense
  };
}

function success(groupid, expense) {
  const expenses = {
    [expense.id]: expense
  };

  return {
    type: constants.UPDATE_EXPENSE_SUCCESS,
    groupid,
    expenses,
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_EXPENSE_FAILURE,
    error,
  };
}
