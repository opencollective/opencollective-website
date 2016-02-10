import merge from 'lodash/object/merge';

import * as constants from '../constants/transactions';

export default function transactions(state={}, action={}) {
  switch (action.type) {
    case constants.TRANSACTIONS_SUCCESS:
    case constants.TRANSACTION_SUCCESS:
      return merge({}, state, action.transactions);

    default:
      return state;
  }
}

