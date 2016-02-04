import merge from 'lodash.merge';
import omit from 'lodash.omit';

import * as constants from '../constants/transactions';

const defaults = {
  approveInProgress: false,
  rejectInProgress: false,
  payInProgress: false,
  updateInProgress: false
};

export default function transactions(state=defaults, action={}) {
  switch (action.type) {

    case constants.CREATE_TRANSACTION_REQUEST:
      return merge({}, omit(state, 'error'));

    case constants.TRANSACTIONS_SUCCESS:
    case constants.TRANSACTION_SUCCESS:
    case constants.CREATE_TRANSACTION_SUCCESS:
    case constants.UPDATE_TRANSACTION_SUCCESS:
      return merge({}, state, action.transactions);

    case constants.CREATE_TRANSACTION_FAILURE:
    case constants.UPDATE_TRANSACTION_FAILURE:
      const error = action.error;
      return merge({}, state, { error });

    case constants.APPROVE_TRANSACTION_REQUEST:
      return merge({}, state, { approveInProgress: true });

    case constants.APPROVE_TRANSACTION_SUCCESS:
    case constants.APPROVE_TRANSACTION_FAILURE:
      return merge({}, state, { approveInProgress: false });

    case constants.REJECT_TRANSACTION_REQUEST:
      return merge({}, state, { rejectInProgress: true });

    case constants.REJECT_TRANSACTION_SUCCESS:
    case constants.REJECT_TRANSACTION_FAILURE:
      return merge({}, state, { rejectInProgress: false });

    case constants.PAY_TRANSACTION_REQUEST:
      return merge({}, state, { payInProgress: true });

    case constants.PAY_TRANSACTION_SUCCESS:
    case constants.PAY_TRANSACTION_FAILURE:
      return merge({}, state, { payInProgress: false });

    case constants.UPDATE_TRANSACTION_REQUEST:
      return merge({}, state, { updateInProgress: true });

    case constants.UPDATE_TRANSACTION_SUCCESS:
    case constants.UPDATE_TRANSACTION_FAILURE:
      return merge({}, state, { updateInProgress: false });

    case constants.DELETE_TRANSACTION_SUCCESS:
      return merge({}, omit(state, action.transactionid));

    default:
      return state;
  }
}

