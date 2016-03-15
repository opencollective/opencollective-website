import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import * as constants from '../../../../frontend/src/constants/transactions';
import fetchById from '../../../../frontend/src/actions/transactions/fetch_by_id';

describe('transactions/fetch_by_id', () => {

  afterEach(() => nock.cleanAll());

  it('creates TRANSACTION_SUCCESS if it fetches successfully', (done) => {
    const transaction = {
      id: 2,
      amount: 999
    };
    const groupid = 1;
    const transactionid = transaction.id;

    nock(env.API_ROOT)
      .get(`/groups/${groupid}/transactions/${transactionid}`)
      .reply(200, transaction);

    const store = mockStore({});

    store.dispatch(fetchById(groupid, transactionid))
    .then(() => {
      const [request, success] = store.getActions();

      expect(request).toEqual({ type: constants.TRANSACTION_REQUEST, groupid, transactionid });
      expect(success).toEqual({
        type: constants.TRANSACTION_SUCCESS,
        groupid,
        transactionid,
        transactions: { 2: transaction }
      });

      done();
    })
    .catch(done);
  });

  it('creates TRANSACTION_FAILURE if it fails to fetch a transaction', (done) => {
    const transaction = {
      id: 2,
      amount: 999
    };
    const groupid = 1;
    const transactionid = transaction.id;

    nock(env.API_ROOT)
      .get(`/groups/${groupid}/transactions/${transactionid}`)
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(fetchById(groupid, transactionid))
    .then(() => {
      const [request, failure] = store.getActions();

      expect(request).toEqual({ type: constants.TRANSACTION_REQUEST, groupid, transactionid });
      expect(failure).toEqual({ type: constants.TRANSACTION_FAILURE, error: new Error('request to http://localhost:3000/api/groups/1/transactions/2 failed') });
      done();
    })
    .catch(done);
  });
});
