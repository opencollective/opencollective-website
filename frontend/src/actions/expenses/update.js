import { postJSON } from '../../lib/api';
import * as constants from '../../constants/expenses';

/**
 * Create an expense
 */

export default (groupid, expenseid, action) => {
  const url = `/groups/${groupid}/expenses/${expenseid}/${action}`;
  console.log("requesting ", url);
  return dispatch => {
    dispatch(request(groupid, expenseid, action));
    return postJSON(url)
      .then(json => dispatch(success(groupid, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(groupid, expenseid, action) {
  return {
    type: constants.UPDATE_EXPENSE_REQUEST,
    groupid,
    expenseid,
    action
  };
}

function success(groupid, expense) {
  console.log("API Response: ", expense);
  const expenses = {
    [expense.id]: expense
  };

  return {
    type: constants.UPDATE_EXPENSE_SUCCESS,
    groupid,
    expenses
  };
}

function failure(error) {
  return {
    type: constants.UPDATE_EXPENSE_FAILURE,
    error
  };
}
