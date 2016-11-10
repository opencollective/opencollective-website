import { postJSON } from '../../lib/api';
import * as constants from '../../constants/expenses';

/**
 * Approve a expense in a group
 */

export default (collectiveId, expenseId) => {
  const url = `/groups/${collectiveId}/expenses/${expenseId}/approve`;

  return dispatch => {
    dispatch(request(collectiveId, expenseId));
    return postJSON(url, {approved: true})
      .then(json => dispatch(success(collectiveId, expenseId, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(collectiveId, expenseId) {
  return {
    type: constants.APPROVE_EXPENSE_REQUEST,
    collectiveId,
    expenseId
  };
}

function success(collectiveId, expenseId, json) {
  return {
    type: constants.APPROVE_EXPENSE_SUCCESS,
    collectiveId,
    expenseId,
    response: json,
  };
}

function failure(error) {
  return {
    type: constants.APPROVE_EXPENSE_FAILURE,
    error,
  };
}
