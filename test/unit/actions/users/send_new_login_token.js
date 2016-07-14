import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import * as constants from '../../../../frontend/src/constants/users';
import sendNewLoginToken from '../../../../frontend/src/actions/users/send_new_login_token';

describe('users/send_new_login_token', () => {
  const email = 'abc@example.com';
  const redirect = '/subscriptions';

  afterEach(() => nock.cleanAll());

  it('returns SEND_NEW_LOGIN_TOKEN_SUCCESS if it fetches successfully', (done) => {
    nock(env.API_ROOT)
      .post('/users/new_login_token')
      .reply(200, {success: true});

    const store = mockStore({});

    store.dispatch(sendNewLoginToken(email, redirect))
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.SEND_NEW_LOGIN_TOKEN_REQUEST, email, redirect });
      expect(success).toEqual({ type: constants.SEND_NEW_LOGIN_TOKEN_SUCCESS, email, redirect });
      done();
    })
    .catch(done);

  });

  it('return SEND_NEW_LOGIN_TOKEN_FAILURE if it fails', (done) => {
    nock(env.API_ROOT)
      .post('/users/new_login_token')
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(sendNewLoginToken(email, redirect))
    .catch(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.SEND_NEW_LOGIN_TOKEN_REQUEST, email, redirect})
      expect(failure.type).toEqual(constants.SEND_NEW_LOGIN_TOKEN_FAILURE);
      expect(failure.email).toEqual(email);
      expect(failure.redirect).toEqual(redirect);
      expect(failure.error.message).toContain('request to http://localhost:3000/api/users/new_login_token failed');
      done();
    })
    .catch(done);
  });

});
