import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import fetchById from '../../../../frontend/src/actions/groups/fetch_by_id';
import * as constants from '../../../../frontend/src/constants/groups';

describe('groups/fetch_by_id', () => {

  afterEach(() => nock.cleanAll());

  it('creates GROUP_SUCCESS when fetching a group is done', (done) => {
    const group = {
      id: 1,
      description: 'happy stuff'
    };

    nock(env.API_ROOT)
      .get('/groups/1')
      .reply(200, group);

    const store = mockStore({});

    store.dispatch(fetchById(1))
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.GROUP_REQUEST, id: 1 });
      expect(success).toEqual({ type: constants.GROUP_SUCCESS, id: 1, groups: {1: group} });
      done();
    })
    .catch(done)
  });

  it('creates GROUP_ERROR when fetching a group fails', (done) => {
    const id = 1;
    nock(env.API_ROOT)
      .get('/groups/1')
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(fetchById(1))
    .then(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.GROUP_REQUEST, id });
      expect(failure.type).toEqual(constants.GROUP_FAILURE);
      expect(failure.id).toEqual(id);
      expect(failure.error.message).toEqual('request to http://localhost:3000/api/groups/1 failed, reason: ');
      done();
    })
    .catch(done)
  });

});
