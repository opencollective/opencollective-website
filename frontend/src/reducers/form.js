import { combineReducers } from 'redux';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

import errorDetail from '../lib/error_detail';
import * as constants from '../constants/form';

/**
 * Validate generic joi schema
 */
function schema(state={
  error: {}
}, action={}) {
  switch (action.type) {
    case constants.VALIDATE_SCHEMA_FAILURE: {
      const {path, message} = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });
    }
    case constants.VALIDATE_SCHEMA_SUCCESS:
      return merge({}, omit(state, 'error'), { error: {} });

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
    case constants.APPEND_PROFILE_FORM:
      return merge({}, state, { attributes: action.attributes });

    case constants.VALIDATE_PROFILE_REQUEST:
      return merge({}, omit(state, 'error'), { error: {} });

    case constants.VALIDATE_PROFILE_FAILURE: {
      const {path, message} = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });
    }
    default:
      return state;
  }
}

/**
 * Donation form
 */
function donation(state={}, action={}) {
  switch (action.type) {
    case constants.APPEND_DONATION_FORM: {
      const newState = {};
      newState[action.tiername] = action.attributes;
      return merge({}, state, newState);
    }
    default:
      return state;
  }
}

/**
 * Expense form
 */
const expenseInitialState = {
  attributes: {
    category: '',
    title: '',
    payoutMethod: 'paypal',
    vat: null,
    incurredAt: new Date()
  },
  error: {}
};

function expense(state=expenseInitialState, action={}) {
  switch (action.type) {
    case constants.RESET_EXPENSE_FORM:
      return merge({}, expenseInitialState);

    case constants.APPEND_EXPENSE_FORM:
      return merge({}, state, { attributes: action.attributes });

    case constants.VALIDATE_SCHEMA_FAILURE:
    case constants.VALIDATE_EXPENSE_FAILURE: {
      const {path, message} = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });
    }
    case constants.VALIDATE_EXPENSE_REQUEST:
      return merge({}, omit(state, 'error'), { error: {} });

    default:
      return state;
  }
}

/**
 * Github form reducer
 */

const githubInitialState = {
  attributes: {}
};

function github(state=githubInitialState, action={}) {
  switch (action.type) {
    case constants.APPEND_GITHUB_FORM:
      return merge({}, state, { attributes: action.attributes });
    default:
      return state;
  }
}

/**
 * Group form reducer
 */

const groupInitialState = {
  attributes: { users1: {}, users2: {}, users3: {}, users4: {}, users5: {}}
};

function addgroup(state=groupInitialState, action={}) {
  switch (action.type) {
    case constants.APPEND_GROUP_FORM:
      return merge({}, state, { attributes: action.attributes });
    default:
      return state;
  }
}

/**
 * Twitter config form
 */
const twitterInitialState = {
  attributes: {},
  error: {}
};

function twitter(state=twitterInitialState, action={}) {
  switch (action.type) {
    case constants.APPEND_TWITTER_CONFIG_FORM:
      return merge({}, state, { attributes: action.attributes });

    default:
      return state;
  }
}

export default combineReducers({
  profile,
  donation,
  expense,
  schema,
  github,
  addgroup,
  twitter
});
