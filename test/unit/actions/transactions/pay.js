import nock from 'nock';
import mockStore from '../../helpers/mockStore';
import env from '../../../../lib/env';
import * as constants from '../../../../constants/transactions';
import payTransaction from '../../../../actions/transactions/pay';

describe('transactions pay actions', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('pay a transaction', () => {

    it('creates PAY_TRANSACTION_SUCCESS if it pays successfully', (done) => {
      const groupid = 1;
      const transactionid = 2;
      const response = { status: 'REIMBURSED' };

      nock(env.API_ROOT)
        .post(`/groups/${groupid}/transactions/${transactionid}/pay`)
        .reply(200, response);

      const expected = [
        { type: constants.PAY_TRANSACTION_REQUEST, groupid, transactionid },
        { type: constants.PAY_TRANSACTION_SUCCESS, groupid, transactionid, json: response }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(payTransaction(groupid, transactionid));
    });

    it('creates PAY_TRANSACTION_FAILURE if it fails', (done) => {
      const groupid = 1;
      const transactionid = 2;

      nock(env.API_ROOT)
        .post(`/groups/${groupid}/transactions/${transactionid}/pay`)
        .replyWithError('Something went wrong!');

      const expected = [
        { type: constants.PAY_TRANSACTION_REQUEST, groupid, transactionid },
        { type: constants.PAY_TRANSACTION_FAILURE, error: new Error('request to http://localhost:3000/api/groups/1/transactions/2/pay failed') }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(payTransaction(groupid, transactionid));
    });

  });

});
