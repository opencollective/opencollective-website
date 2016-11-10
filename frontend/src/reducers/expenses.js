import merge from 'lodash/merge';
import extend from 'lodash/extend';
import * as constants from '../constants/expenses';

const defaults = {
  approveInProgress: {},
  rejectInProgress: {},
  payInProgress: {}
};

export default function expenses(state=defaults, action={}) {
  switch (action.type) {
    case constants.APPROVE_EXPENSE_REQUEST:
      return merge({}, state, {
        approveInProgress: merge({}, state.approveInProgress, {[action.expenseId]: true})
      });

    case constants.REJECT_EXPENSE_REQUEST:
      return merge({}, state, {
        rejectInProgress: merge({}, state.rejectInProgress, {[action.expenseId]: true})
      });

    case constants.PAY_EXPENSE_REQUEST:
      return merge({}, state, {
        payInProgress: merge({}, state.payInProgress, {[action.expenseId]: true})
      });


    case constants.APPROVE_EXPENSE_SUCCESS:
    case constants.APPROVE_EXPENSE_FAILURE:
      return merge({}, state, {approveInProgress: merge({}, state.approveInProgress, {[action.expenseId]: false})});

    case constants.REJECT_EXPENSE_SUCCESS:
    case constants.REJECT_EXPENSE_FAILURE:
      return merge({}, state, {rejectInProgress: merge({}, state.rejectInProgress, {[action.expenseId]: false})});

    case constants.PAY_EXPENSE_SUCCESS:
    case constants.PAY_EXPENSE_FAILURE:
      return merge({}, state, {payInProgress: merge({}, state.payInProgress, {[action.expenseId]: false})});

    case constants.PENDING_EXPENSES_SUCCESS:
      return extend({}, state, {unpaid: action.expenses});

    case constants.EXPENSES_SUCCESS:
    case constants.EXPENSE_SUCCESS: {
      const {expenses} = action;
      return merge({}, state, expenses);
    }
    default:
      return state;
  }
}