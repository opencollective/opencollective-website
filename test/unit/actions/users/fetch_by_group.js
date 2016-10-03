import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import * as constants from '../../../../frontend/src/constants/users';
import fetchByGroup from '../../../../frontend/src/actions/users/fetch_by_group';

describe('users/fetch_by_group', () => {

  afterEach(() => nock.cleanAll());

  it('returns FETCH_USERS_BY_GROUP_SUCCESS if it fetches successfully', (done) => {
    const user = {
      id: 2,
      name: 'Jeff'
    };
    const slug = 'testgroup';

    nock(env.API_ROOT)
      .get(`/groups/${slug}/users`)
      .reply(200, [user]);

    const store = mockStore({});

    store.dispatch(fetchByGroup(slug))
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.FETCH_USERS_BY_GROUP_REQUEST, slug })
      expect(success).toEqual({ type: constants.FETCH_USERS_BY_GROUP_SUCCESS, slug, users: [user] })
      done();
    })
    .catch(done)
  });

  it('return FETCH_USERS_BY_GROUP_FAILURE if it fails', (done) => {
    const slug = 1;

    nock(env.API_ROOT)
      .get(`/groups/${slug}/users`)
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(fetchByGroup(slug))
    .then(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.FETCH_USERS_BY_GROUP_REQUEST, slug });
      expect(failure.type).toEqual(constants.FETCH_USERS_BY_GROUP_FAILURE);
      expect(failure.error.message).toContain('request to http://localhost:3000/api/groups/1/users failed');
      done();
    })
    .catch(done)
  });

});
