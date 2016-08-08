import * as constants from '../constants/connected_accounts';

export default function connectedAccounts(state={}, action) {

  switch (action.type) {
    case constants.CONNECTED_ACCOUNTS_SUCCESS:
      return action.connectedAccounts;

    default:
      return state;
  }
}
