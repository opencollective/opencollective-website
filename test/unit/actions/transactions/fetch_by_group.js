import nock from 'nock';
import expect from 'expect';
import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import * as constants from '../../../../frontend/src/constants/transactions';
import fetchByGroup from '../../../../frontend/src/actions/transactions/fetch_by_group';

describe('transactions/fetch_by_group actions', () => {

  afterEach(() => nock.cleanAll());
  const options = {};

  it('creates TRANSACTIONS_SUCCESS if it fetches successfully', (done) => {
    const transaction = {
      id: 2,
      amount: 999
    };
    const slug = 'testgroup';

    nock(env.API_ROOT)
      .get(`/groups/${slug}/expenses`)
      .reply(200, [transaction]);

    const store = mockStore({});

    store.dispatch(fetchByGroup(slug))
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.TRANSACTIONS_REQUEST, slug, options })
      expect(success).toEqual({ type: constants.TRANSACTIONS_SUCCESS, slug, transactions: { 2: transaction } })
      done();
    })
    .catch(done)
  });

  it('creates TRANSACTIONS_FAILURE if it fails', (done) => {
    const slug = 1;

    nock(env.API_ROOT)
      .get(`/groups/${slug}/expenses`)
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(fetchByGroup(slug))
    .then(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.TRANSACTIONS_REQUEST, slug, options });
      expect(failure.type).toEqual(constants.TRANSACTIONS_FAILURE);
      expect(failure.error.message).toContain('request to http://localhost:3000/api/groups/1/expenses failed');
      done();
    })
    .catch(done)
  });

});
