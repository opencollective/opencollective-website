import { postJSON } from '../../lib/api';
import * as constants from '../../constants/expenses';

/**
 * Pay a expense
 */

export default (collectiveId, expenseId) => {
  const url = `/groups/${collectiveId}/expenses/${expenseId}/pay`;

  return dispatch => {
    dispatch(request(collectiveId, expenseId));
    return postJSON(url, { service: 'paypal' })
      .then(json => dispatch(success(collectiveId, expenseId, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(collectiveId, expenseId) {
  return {
    type: constants.PAY_EXPENSE_REQUEST,
    collectiveId,
    expenseId
  };
}

function success(collectiveId, expenseId, json) {
  return {
    type: constants.PAY_EXPENSE_SUCCESS,
    collectiveId,
    expenseId,
    json
  };
}

function failure(error) {
  return {
    type: constants.PAY_EXPENSE_FAILURE,
    error
  };
}
