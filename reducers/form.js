import { combineReducers } from 'redux';
import merge from 'lodash.merge';
import omit from 'lodash.omit';

import errorDetail from '../lib/error_detail';
import * as constants from '../constants/form';

/**
 * Validate generic joi schema
 */

function schema(state={
  error: {}
}, action={}) {
  switch (action.type) {
    case constants.VALIDATE_SCHEMA_FAILURE:
      const { path, message } = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });

    case constants.VALIDATE_SCHEMA_SUCCESS:
    case constants.VALIDATE_SCHEMA_FAILURE:
      return merge({}, omit(state, 'error'), { error: {} });

    default:
      return state;
  }
}

/**
 * New transaction form reducer
 */
const transactionInitialState = {
  attributes: {
    tags: [],
    description: '',
    paymentMethod: 'paypal',
    vat: null,
    createdAt: new Date()
  },
  error: {}
};

function transaction(state=transactionInitialState, action={}) {
  switch (action.type) {
    case constants.RESET_TRANSACTION_FORM:
      return merge({}, transactionInitialState);

    case constants.APPEND_TRANSACTION_FORM:
      return merge({}, state, { attributes: action.attributes });

    case constants.VALIDATE_SCHEMA_FAILURE:
    case constants.VALIDATE_TRANSACTION_FAILURE:
      const { path, message } = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });

    case constants.VALIDATE_SCHEMA_FAILURE:
    case constants.VALIDATE_TRANSACTION_REQUEST:
      return merge({}, omit(state, 'error'), { error: {} });

    default:
      return state;
  }
}

/**
 * Login form reducer
 */

const loginInitialState = {
  error: {}
};

function login(state=loginInitialState, action={}) {
  switch (action.type) {
    case constants.RESET_LOGIN_FORM:
      return merge({}, loginInitialState);

    case constants.VALIDATE_LOGIN_FAILURE:
      const { message, path } = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });

    default:
      return state;
  }
}

/**
 * User profile form reducer
 */

const profileInitialState = {
  attributes: {},
  error: {},
  isEditMode: false
};

function profile(state=profileInitialState, action={}) {
  switch (action.type) {
    case constants.SET_EDIT_MODE_PROFILE:
      if (!action.isEditMode) {
        return merge({}, profileInitialState, { isEditMode: action.isEditMode });
      }
      return merge({}, state, { isEditMode: action.isEditMode });

    case constants.APPEND_PROFILE_FORM:
      return merge({}, state, { attributes: action.attributes });

    case constants.VALIDATE_PROFILE_REQUEST:
    case constants.VALIDATE_DONATION_PROFILE_REQUEST:
      return merge({}, omit(state, 'error'), { error: {} });

    case constants.VALIDATE_PROFILE_FAILURE:
    case constants.VALIDATE_DONATION_PROFILE_FAILURE:
      const { path, message } = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });
    default:
      return state;
  }
}

/**
 * Group settings form reducer
 */

const groupSettingsInitialState = {
  attributes: {},
  error: {}
};

function groupSettings(state=groupSettingsInitialState, action={}) {
  switch (action.type) {
    case constants.APPEND_GROUP_SETTINGS_FORM:
      return merge({}, state, { attributes: action.attributes });

    case constants.VALIDATE_GROUP_SETTING_ATTRIBUTE_CHANGE_REQUEST:
      return merge({}, omit(state, 'error'), { error: {} });

    case constants.VALIDATE_GROUP_SETTING_ATTRIBUTE_CHANGE_FAILURE:
      const { path, message } = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });

    default:
      return state;
  }
}

/**
 * Donation form
 */

function donation(state={
  attributes: {
    amount: null,
    frequency: null
  }
}, action={}) {
  switch(action.type) {
    case constants.APPEND_DONATION_FORM:
      return merge({}, state, { attributes: action.attributes });
    default:
      return state;
  }
}

export default combineReducers({
  transaction,
  login,
  profile,
  donation,
  groupSettings,
  schema
});
