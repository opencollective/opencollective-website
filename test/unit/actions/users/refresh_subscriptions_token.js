import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import * as constants from '../../../../frontend/src/constants/users';
import refreshSubscriptionsToken from '../../../../frontend/src/actions/users/refresh_subscriptions_token';

describe('users/refresh_subscriptions_token', () => {

  afterEach(() => nock.cleanAll());

  it('returns REFRESH_SUBSCRIPTIONS_TOKEN_SUCCESS if it fetches successfully', (done) => {
    const token = 'abc';

    nock(env.API_ROOT)
      .post('/subscriptions/refresh_token')
      .reply(200, {success: true});

    const store = mockStore({});

    store.dispatch(refreshSubscriptionsToken(token))
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.REFRESH_SUBSCRIPTIONS_TOKEN_REQUEST, token })
      expect(success).toEqual({ type: constants.REFRESH_SUBSCRIPTIONS_TOKEN_SUCCESS, token })
      done();
    })
    .catch(done);

  });

  it('return REFRESH_SUBSCRIPTIONS_TOKEN_FAILURE if it fails', (done) => {
    const token = 'abc';

    nock(env.API_ROOT)
      .post('/subscriptions/refresh_token')
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(refreshSubscriptionsToken(token))
    .catch(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.REFRESH_SUBSCRIPTIONS_TOKEN_REQUEST, token })
      expect(failure.type).toEqual(constants.REFRESH_SUBSCRIPTIONS_TOKEN_FAILURE);
      expect(failure.error.message).toContain('request to http://localhost:3000/api/subscriptions/refresh_token failed');
      done();
    })
    .catch(done);
  });

});
