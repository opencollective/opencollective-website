import merge from 'lodash/object/merge';
import values from 'lodash/object/values';

import * as constants from '../constants/transactions';

export default function transactions(state={
  isDonation: [],
  isExpense: []
}, action={}) {
  switch (action.type) {
    case constants.TRANSACTIONS_SUCCESS:
    case constants.TRANSACTION_SUCCESS:
      const { transactions } = action;
      const transactionsArr = values(transactions);

      return merge({}, state, transactions, {
        isDonation: transactionsArr.filter(t => t.isDonation),
        isExpense: transactionsArr.filter(t => t.isExpense)
      });

    default:
      return state;
  }
}

