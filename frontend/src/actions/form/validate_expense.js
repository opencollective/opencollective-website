import * as constants from '../../constants/form';
import expenseIsValid from '../../validators/expense';

/**
 * Validate expense submission form
 */

export default (newExpense) => {
  return dispatch => {
    dispatch(request(newExpense));

    return expenseIsValid(newExpense)
    .then(expense => dispatch(success(expense)))
    .catch(error => {
      dispatch(failure(error));
      throw new Error(error.details[0].message);
    });
  };
};

function request(expense) {
  return {
    type: constants.VALIDATE_EXPENSE_REQUEST,
    expense
  };
}

function success(expense) {
  return {
    type: constants.VALIDATE_EXPENSE_SUCCESS,
    expense
  };
}

function failure(error) {
  return {
    type: constants.VALIDATE_EXPENSE_FAILURE,
    error
  };
}
