import merge from 'lodash/merge';
import values from 'lodash/values';

import * as constants from '../constants/transactions';

export default function transactions(state={
  donations: [],
  expenses: []
}, action={}) {
  switch (action.type) {
    case constants.TRANSACTIONS_SUCCESS:
    case constants.TRANSACTION_SUCCESS: {
      const {transactions} = action;
      const transactionsArr = values(transactions);
      return merge({}, state, transactions, {
        donations: transactionsArr.filter(t => t.isDonation),
        expenses: transactionsArr.filter(t => t.isExpense)
      });
    }
    default:
      return state;
  }
}