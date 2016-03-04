import nock from 'nock';

import mockStore from '../helpers/mockStore';
import env from '../../../frontend/src/lib/env';
import cancelSubscription from '../../../frontend/src/actions/subscriptions/cancel';
import * as constants from '../../../frontend/src/constants/subscriptions';

describe('subscriptions actions', () => {

  afterEach(() => nock.cleanAll());

  describe('Cancel subscription', () => {
    it('dispatches CANCEL_SUBSCRIPTION_SUCCESS', (done) => {
      const token = 'token_abc';
      const id = 1;

      nock(env.API_ROOT)
        .post(`/subscriptions/${id}/cancel`)
        .reply(200, { success: true });

      const expected = [
        { type: constants.CANCEL_SUBSCRIPTION_REQUEST, id, token },
        { type: constants.CANCEL_SUBSCRIPTION_SUCCESS, id, token }
      ];
      const store = mockStore({}, expected, done);
      store.dispatch(cancelSubscription(id, token));
    });

   it('dispatches CANCEL_SUBSCRIPTION_FAILURE when it fails', (done) => {
      const token = 'token_abc';
      const id = 1;

      nock(env.API_ROOT)
        .post(`/subscriptions/${id}/cancel`)
        .replyWithError('');

      const error = new Error(`request to http://localhost:3000/api/subscriptions/${id}/cancel failed`);

      const expected = [
        { type: constants.CANCEL_SUBSCRIPTION_REQUEST, id, token },
        { type: constants.CANCEL_SUBSCRIPTION_FAILURE, id, token, error }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(cancelSubscription(id, token));
    });
  });

});
