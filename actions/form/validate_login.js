import loginIsValid from '../../validators/login';
import * as constants from '../../constants/form';

/**
 * Validate login form
 */

export default (attributes) => {
  return dispatch => {
    dispatch(request(attributes));

    return loginIsValid(attributes)
    .then(attributes => dispatch(success(attributes)))
    .catch(error => {
      dispatch(failure(error));
      throw new Error(error.details[0].message);
    });
  };
};

function request() {
  return {
    type: constants.VALIDATE_LOGIN_REQUEST
  };
}

function failure(attributes) {
  return {
    type: constants.VALIDATE_LOGIN_SUCCESS,
    attributes
  };
}

function success(error) {
  return {
    type: constants.VALIDATE_LOGIN_FAILURE,
    error
  };
}
