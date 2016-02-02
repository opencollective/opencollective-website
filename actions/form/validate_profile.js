import * as constants from '../../constants/form';
import profileIsValid from '../../validators/profile';

/**
 * Validate transaction form
 */

export default (newProfile) => {
  return dispatch => {
    dispatch(request(newProfile));

    return profileIsValid(newProfile)
    .then(profile => dispatch(success(profile)))
    .catch(error => {
      dispatch(failure(error));
      throw new Error(error.details[0].message);
    });
  };
};

function request(profile) {
  return {
    type: constants.VALIDATE_PROFILE_REQUEST,
    profile
  };
}

function success(profile) {
  return {
    type: constants.VALIDATE_PROFILE_SUCCESS,
    profile
  };
}

function failure(error) {
  return {
    type: constants.VALIDATE_PROFILE_FAILURE,
    error
  };
}
