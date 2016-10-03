import merge from 'lodash/merge';
import * as constants from '../constants/expenses';

export default function expenses(state={}, action={}) {
  switch (action.type) {
    case constants.EXPENSES_SUCCESS:
    case constants.EXPENSE_SUCCESS: {
      const {expenses} = action;
      return merge({}, state, expenses);
    }
    default:
      return state;
  }
}