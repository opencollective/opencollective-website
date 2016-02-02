import nock from 'nock';
import _ from 'lodash';
import mockStore from '../../helpers/mockStore';
import env from '../../../../lib/env';
import * as constants from '../../../../constants/transactions';
import createTransaction from '../../../../actions/transactions/create';

describe('transactions create actions', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  it('creates CREATE_TRANSACTION_SUCCESS if it is successful', (done) => {
    const groupid = 1;
    const transaction = { amount: 999 };
    const response = _.extend(transaction, { id: 2 });
    const transactions = {
      [response.id]: response
    };

    nock(env.API_ROOT)
      .post(`/groups/${groupid}/transactions/`, {transaction})
      .reply(200, response);

    const expected = [
      { type: constants.CREATE_TRANSACTION_REQUEST, groupid, transaction },
      { type: constants.CREATE_TRANSACTION_SUCCESS, groupid, transactions }
    ];

    const store = mockStore({}, expected, done);
    store.dispatch(createTransaction(groupid, transaction));
  });

  it('creates CREATE_TRANSACTION_FAILURE if it fails', (done) => {
    const groupid = 1;
    const transaction = { amount: 999 };

    nock(env.API_ROOT)
      .post(`/groups/${groupid}/transactions/`)
      .replyWithError('');

    const expected = [
      { type: constants.CREATE_TRANSACTION_REQUEST, groupid, transaction },
      { type: constants.CREATE_TRANSACTION_FAILURE, error: new Error('request to http://localhost:3000/api/groups/1/transactions/ failed') }
    ];

    const store = mockStore({}, expected, done);
    store.dispatch(createTransaction(groupid, transaction));
  });

});
