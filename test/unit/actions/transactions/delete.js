import nock from 'nock';
import mockStore from '../../helpers/mockStore';
import env from '../../../../lib/env';
import * as constants from '../../../../constants/transactions';
import deleteTransaction from '../../../../actions/transactions/delete';

describe('transactions delete actions', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  it('creates DELETE_TRANSACTION_SUCCESS if it is successful', (done) => {
    const groupid = 1;
    const transactionid = 2;

    nock(env.API_ROOT)
      .delete(`/groups/${groupid}/transactions/${transactionid}`)
      .reply(200, { success: true });

    const expected = [
      { type: constants.DELETE_TRANSACTION_REQUEST, groupid, transactionid },
      { type: constants.DELETE_TRANSACTION_SUCCESS, groupid, transactionid }
    ];

    const store = mockStore({}, expected, done);
    store.dispatch(deleteTransaction(groupid, transactionid));
  });

  it('creates DELETE_TRANSACTION_FAILURE if it fails', (done) => {
    const groupid = 1;
    const transactionid = 2;

    nock(env.API_ROOT)
      .delete(`/groups/${groupid}/transactions/${transactionid}`)
      .replyWithError('');

    const expected = [
      { type: constants.DELETE_TRANSACTION_REQUEST, groupid, transactionid },
      { type: constants.DELETE_TRANSACTION_FAILURE, error: new Error() }
    ];

    const store = mockStore({}, expected, done);
    store.dispatch(deleteTransaction(groupid, transactionid));
  });

});
