import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import * as constants from '../../../../frontend/src/constants/users';
import updateUser from '../../../../frontend/src/actions/users/update';

describe('users/update', () => {
  const attributes = { email: 'abc@example.com' };
  const userid = 1;

  afterEach(() => nock.cleanAll());

  it('returns UPDATE_USER_SUCCESS if it fetches successfully', (done) => {
    nock(env.API_ROOT)
      .put(`/users/${userid}`, { user: attributes })
      .reply(200, attributes);

    const store = mockStore({});

    store.dispatch(updateUser(userid, attributes))
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.UPDATE_USER_REQUEST, userid, attributes });
      expect(success).toEqual({ type: constants.UPDATE_USER_SUCCESS, userid, attributes, json: attributes });
      done();
    })
    .catch(done);

  });

  it('return UPDATE_USER_FAILURE if it fails', (done) => {
    nock(env.API_ROOT)
      .put(`/users/${userid}`)
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(updateUser(userid, attributes))
    .catch(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.UPDATE_USER_REQUEST, userid, attributes });
      expect(failure.type).toEqual(constants.UPDATE_USER_FAILURE);
      expect(failure.error.message).toEqual('request to http://localhost:3000/api/users/1 failed, reason: ');
      done();
    })
    .catch(done);
  });

});
