import { postJSON } from '../../lib/api';
import * as constants from '../../constants/expenses';

/**
 * Create an expense
 */

export default (slug, expense) => {
  const url = `/groups/${slug}/expenses/`;

  return dispatch => {
    dispatch(request(slug, expense));
    return postJSON(url, {expense})
      .then(json => dispatch(success(slug, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(slug, expense) {
  return {
    type: constants.CREATE_EXPENSE_REQUEST,
    slug,
    expense
  };
}

function success(slug, expense) {
  const expenses = {
    [expense.id]: expense
  };

  return {
    type: constants.CREATE_EXPENSE_SUCCESS,
    slug,
    expenses
  };
}

function failure(error) {
  return {
    type: constants.CREATE_EXPENSE_FAILURE,
    error
  };
}
