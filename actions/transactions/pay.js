import { postJSON } from '../../lib/api';
import * as constants from '../../constants/transactions';

/**
 * Pay a transaction
 */

export default (groupid, transactionid) => {
  const url = `groups/${groupid}/transactions/${transactionid}/pay`;

  return dispatch => {
    dispatch(request(groupid, transactionid));
    return postJSON(url, { service: 'paypal' })
      .then(json => dispatch(success(groupid, transactionid, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(groupid, transactionid) {
  return {
    type: constants.PAY_TRANSACTION_REQUEST,
    groupid,
    transactionid
  };
}

function success(groupid, transactionid, json) {
  return {
    type: constants.PAY_TRANSACTION_SUCCESS,
    groupid,
    transactionid,
    json
  };
}

function failure(error) {
  return {
    type: constants.PAY_TRANSACTION_FAILURE,
    error
  };
}
