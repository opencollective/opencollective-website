import nock from 'nock';

import mockStore from '../helpers/mockStore';
import env from '../../../lib/env';
import fetchById from '../../../actions/groups/fetch_by_id';
import donate from '../../../actions/groups/donate';
import * as constants from '../../../constants/groups';

describe('groups actions', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Fetch group', () => {
    it('creates GROUP_SUCCESS when fetching a group is done', (done) => {
      const group = {
        id: 1,
        description: 'happy stuff'
      };

      nock(env.API_ROOT)
        .get('/groups/1')
        .reply(200, group);

      const expected = [
        { type: constants.GROUP_REQUEST, id: 1 },
        { type: constants.GROUP_SUCCESS, id: 1, groups: {1: group} }
      ];
      const store = mockStore({}, expected, done);
      store.dispatch(fetchById(1));
    });

    it('creates GROUP_ERROR when fetching a group fails', (done) => {
      nock(env.API_ROOT)
        .get('/groups/1')
        .replyWithError('');

      const error = new Error('request to http://localhost:3000/api/groups/1 failed');

      // Improve test with error message
      const expected = [
        { type: constants.GROUP_REQUEST, id: 1 },
        {
          type: constants.GROUP_FAILURE,
          id: 1,
          error
        }
      ];
      const store = mockStore({}, expected, done);
      store.dispatch(fetchById(1));
    });
  });

  describe('Donate to group', () => {
    it('creates DONATE_GROUP_SUCCESS when fetching a group is done', (done) => {
      const payment = {
        amount: 10,
        stripeToken: 'tok_123'
      };

      const json = payment;
      nock(env.API_ROOT)
        .post('/groups/1/payments/')
        .reply(200, payment);

      const expected = [
        { type: constants.DONATE_GROUP_REQUEST, id: 1, payment },
        { type: constants.DONATE_GROUP_SUCCESS, id: 1, json }
      ];
      const store = mockStore({}, expected, done);
      store.dispatch(donate(1, payment));
    });

    it('creates DONATE_GROUP_FAILURE when donating fails', (done) => {
      const payment = {
        amount: 10,
        stripeToken: 'tok_123'
      };

      nock(env.API_ROOT)
        .post('/groups/1/payments/')
        .replyWithError('');

      const expected = [
        { type: constants.DONATE_GROUP_REQUEST, id: 1, payment },
        { type: constants.DONATE_GROUP_FAILURE, error: new Error('request to http://localhost:3000/api/groups/1/payments/ failed')}
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(donate(1, payment));
    });
  });

});
