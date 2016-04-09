import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import * as constants from '../../../../frontend/src/constants/users';
import sendNewSubscriptionToken from '../../../../frontend/src/actions/users/send_new_subscriptions_token';

describe('users/send_new_subscriptions_token', () => {
  const email = 'abc@example.com';

  afterEach(() => nock.cleanAll());

  it('returns SEND_NEW_SUBSCRIPTIONS_TOKEN_SUCCESS if it fetches successfully', (done) => {
    nock(env.API_ROOT)
      .post('/subscriptions/new_token')
      .reply(200, {success: true});

    const store = mockStore({});

    store.dispatch(sendNewSubscriptionToken(email))
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.SEND_NEW_SUBSCRIPTIONS_TOKEN_REQUEST, email })
      expect(success).toEqual({ type: constants.SEND_NEW_SUBSCRIPTIONS_TOKEN_SUCCESS, email })
      done();
    })
    .catch(done);

  });

  it('return SEND_NEW_SUBSCRIPTIONS_TOKEN_FAILURE if it fails', (done) => {
    nock(env.API_ROOT)
      .post('/subscriptions/new_token')
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(sendNewSubscriptionToken(email))
    .catch(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.SEND_NEW_SUBSCRIPTIONS_TOKEN_REQUEST, email });
      expect(failure.type).toEqual(constants.SEND_NEW_SUBSCRIPTIONS_TOKEN_FAILURE);
      expect(failure.error.message).toEqual('request to http://localhost:3000/api/subscriptions/new_token failed, reason: ');
      done();
    })
    .catch(done);
  });

});
