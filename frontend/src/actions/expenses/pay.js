import { postJSON } from '../../lib/api';
import * as constants from '../../constants/expenses';

/**
 * Pay a expense
 */

export default (groupid, expenseid) => {
  const url = `/groups/${groupid}/expenses/${expenseid}/pay`;

  return dispatch => {
    dispatch(request(groupid, expenseid));
    return postJSON(url, { service: 'paypal' })
      .then(json => dispatch(success(groupid, expenseid, json)))
      .catch(error => {
        dispatch(failure(error));
        throw new Error(error.message);
      });
  };
};

function request(groupid, expenseid) {
  return {
    type: constants.PAY_EXPENSE_REQUEST,
    groupid,
    expenseid
  };
}

function success(groupid, expenseid, json) {
  return {
    type: constants.PAY_EXPENSE_SUCCESS,
    groupid,
    expenseid,
    json
  };
}

function failure(error) {
  return {
    type: constants.PAY_EXPENSE_FAILURE,
    error
  };
}
