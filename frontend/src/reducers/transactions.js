import merge from 'lodash/merge';
import values from 'lodash/values';

import * as constants from '../constants/transactions';

export default function transactions(state={
  isDonation: [],
  isExpense: []
}, action={}) {
  switch (action.type) {
    case constants.TRANSACTIONS_SUCCESS:
    case constants.TRANSACTION_SUCCESS: {
      const {transactions} = action;
      const transactionsArr = values(transactions);

      return merge({}, state, transactions, {
        isDonation: transactionsArr.filter(t => t.isDonation),
        isExpense: transactionsArr.filter(t => t.incurredAt)
      });
    }
    default:
      return state;
  }
}