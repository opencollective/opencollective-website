import * as constants from '../../constants/form';
import transactionIsValid from '../../validators/transaction';

/**
 * Validate expense submission form
 */

export default (newTransaction) => {
  return dispatch => {
    dispatch(request(newTransaction));

    return transactionIsValid(newTransaction)
    .then(transaction => dispatch(success(transaction)))
    .catch(error => {
      dispatch(failure(error));
      throw new Error(error.details[0].message);
    });
  };
};

function request(transaction) {
  return {
    type: constants.VALIDATE_TRANSACTION_REQUEST,
    transaction
  };
}

function success(transaction) {
  return {
    type: constants.VALIDATE_TRANSACTION_SUCCESS,
    transaction
  };
}

function failure(error) {
  return {
    type: constants.VALIDATE_TRANSACTION_FAILURE,
    error
  };
}
