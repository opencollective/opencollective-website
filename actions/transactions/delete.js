import * as api from '../../lib/api';
import * as constants from '../../constants/transactions';

/**
 * Deletea a transaction from a group
 */

export default (groupid, transactionid) => {
  return dispatch => {
    dispatch(request(groupid, transactionid));

    return api.del(`groups/${groupid}/transactions/${transactionid}`)
      .then(json => dispatch(success(groupid, transactionid, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(groupid, transactionid) {
  return {
    type: constants.DELETE_TRANSACTION_REQUEST,
    groupid,
    transactionid
  };
}

function success(groupid, transactionid) {
  return {
    type: constants.DELETE_TRANSACTION_SUCCESS,
    groupid,
    transactionid
  };
}

function failure(error) {
  return {
    type: constants.DELETE_TRANSACTION_FAILURE,
    error
  };
}
