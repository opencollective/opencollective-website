import { combineReducers } from 'redux';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

import errorDetail from '../lib/error_detail';
import * as constants from '../constants/form';
import {
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_SUCCESS,
  CREATE_EXPENSE_FAILURE } from '../constants/expenses';

import {
  CREATE_ADDFUNDS_REQUEST,
  CREATE_ADDFUNDS_FAILURE,
  CREATE_ADDFUNDS_SUCCESS } from '../constants/addfunds';

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
  error: {},
  inProgress: false
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

    case CREATE_EXPENSE_REQUEST:
      return merge({}, state, {inProgress: true})

    case CREATE_EXPENSE_SUCCESS:
    case CREATE_EXPENSE_FAILURE:
      return merge({}, state, {inProgress: false})

    default:
      return state;
  }
}

/**
 *
 */
const addFundsInitialState = {
  attributes: {
    amount: 0,
    email: null,
    name: null,
    title: '',
    notes: '',
    fundsFromHost: true
  },
  error: {},
  inProgress: false
};

function addFunds(state=addFundsInitialState, action={}) {
  switch (action.type) {
    case constants.RESET_ADDFUNDS_FORM:
      return merge({}, addFundsInitialState);

    case constants.APPEND_ADDFUNDS_FORM:
      return merge({}, state, { attributes: action.attributes });

    case constants.VALIDATE_ADDFUNDS_FAILURE: {
      const {path, message} = errorDetail(action);

      return merge({}, state, {
        error: {
          [path]: true,
          message
        }
      });      
    }

    case constants.VALIDATE_ADDFUNDS_REQUEST:
      return merge({}, omit(state, 'error'), { error: {} });

    case CREATE_ADDFUNDS_REQUEST:
      return merge({}, state, { inProgress: true });

    case CREATE_ADDFUNDS_SUCCESS:
    case CREATE_ADDFUNDS_FAILURE:
      return merge({}, state, { inProgress: false });

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
 * Add group form reducer
 */
function addgroup(state={ attributes: { users: [ {} ]} }, action={}) {
  switch (action.type) {
    case constants.APPEND_GROUP_FORM:
      return merge({}, state, { attributes: merge({}, state.attributes, action.attributes) });
    default:
      return state;
  }
}

/**
 * Edit group form reducer
 */

const editGroupInitialState = {
  attributes: { },
  inProgress: false
};

function editGroup(state=editGroupInitialState, action={}) {
  switch (action.type) {
    case constants.APPEND_EDIT_GROUP_FORM:
      return merge({}, state, {attributes: action.attributes, inProgress: true});
    case constants.CANCEL_EDIT_GROUP_FORM:
      return editGroupInitialState;
    default:
      return state;
  }
}

/**
 * Edit collective form reducer
 */

const editCollectiveInitialState = {
  attributes: { },
  inProgress: false
};

function editCollective(state=editCollectiveInitialState, action={}) {
  switch (action.type) {
    case constants.APPEND_EDIT_COLLECTIVE_FORM:
      return merge({}, state, {attributes: action.attributes, inProgress: true});
    case constants.CANCEL_EDIT_COLLECTIVE_FORM:
      return editCollectiveInitialState;
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
  editGroup,
  editCollective,
  twitter,
  addFunds
});
