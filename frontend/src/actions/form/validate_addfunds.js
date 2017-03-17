import * as constants from '../../constants/form';
import addFundsRequestIsValid from '../../validators/addfunds';

/**
 * Validate add funds submission form
 */

export default (donation) => {
  return dispatch => {
    dispatch(request(donation));

    return addFundsRequestIsValid(donation)
    .then(donation => dispatch(success(donation)))
    .catch(error => {
      dispatch(failure(error));
      throw new Error(error.details[0].message);
    });
  };
};

function request(donation) {
  return {
    type: constants.VALIDATE_ADDFUNDS_REQUEST,
    donation
  };
}

function success(donation) {
  return {
    type: constants.VALIDATE_ADDFUNDS_SUCCESS,
    donation
  };
}

function failure(error) {
  return {
    type: constants.VALIDATE_ADDFUNDS_FAILURE,
    error
  };
}
