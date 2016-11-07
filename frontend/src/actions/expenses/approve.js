import { postJSON } from '../../lib/api';
import * as constants from '../../constants/expenses';

/**
 * Approve a expense in a group
 */

export default (groupid, expenseid) => {
  const url = `/groups/${groupid}/expenses/${expenseid}/approve`;

  return dispatch => {
    dispatch(request(groupid, expenseid));
    return postJSON(url, {approved: true})
      .then(json => dispatch(success(groupid, expenseid, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(groupid, expenseid) {
  return {
    type: constants.APPROVE_EXPENSE_REQUEST,
    groupid,
    expenseid
  };
}

function success(groupid, expenseid, json) {
  return {
    type: constants.APPROVE_EXPENSE_SUCCESS,
    groupid,
    expenseid,
    response: json,
  };
}

function failure(error) {
  return {
    type: constants.APPROVE_EXPENSE_FAILURE,
    error,
  };
}
