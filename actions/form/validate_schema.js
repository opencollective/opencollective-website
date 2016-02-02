import * as constants from '../../constants/form';
import validate from '../../lib/validate';

/**
 * Validate a schema
 */

export default (obj, schema) => {
 return dispatch => {
  dispatch(request(obj, schema));

  return validate(obj, schema)
    .then(value => dispatch(success(obj, schema, value)))
    .catch(error => {
      dispatch(failure(error));
      throw new Error(error.details[0].message);
    });
  };
};

function request(obj, schema) {
  return {
    type: constants.VALIDATE_SCHEMA_REQUEST,
    obj,
    schema
  };
}

function success(obj, schema, value) {
  return {
    type: constants.VALIDATE_SCHEMA_SUCCESS,
    obj,
    schema,
    value
  };
}

function failure(error) {
  return {
    type: constants.VALIDATE_SCHEMA_FAILURE,
    error
  };
}
