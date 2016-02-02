import * as constants from '../../constants/form';
import groupSettingsAreValid from '../../validators/group_settings';

/**
 * Validate group settings form change
 */

export default (newAttribute) => {
  return dispatch => {
    dispatch(request(newAttribute));

    return groupSettingsAreValid(newAttribute)
    .then(attribute => dispatch(success(attribute)))
    .catch(error => {
      dispatch(failure(error));
      throw new Error(error.details[0].message);
    });
  };
};

function request(attribute) {
  return {
    type: constants.VALIDATE_GROUP_SETTING_ATTRIBUTE_CHANGE_REQUEST,
    attribute
  };
}

function success(attribute) {
  return {
    type: constants.VALIDATE_GROUP_SETTING_ATTRIBUTE_CHANGE_SUCCESS,
    attribute
  };
}

function failure(error) {
  return {
    type: constants.VALIDATE_GROUP_SETTING_ATTRIBUTE_CHANGE_FAILURE,
    error
  };
}
