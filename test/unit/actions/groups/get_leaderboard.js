import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import getLeaderboard from '../../../../frontend/src/actions/groups/get_leaderboard';
import * as constants from '../../../../frontend/src/constants/groups';

describe('groups/get_leaderboard', () => {

  afterEach(() => nock.cleanAll());

  it('returns GET_LEADERBOARD_REQUEST when fetching the leaderboard', (done) => {
    const leaderboard = [{
      id: 1,
      totalAmount: 1000
    }];

    nock(env.API_ROOT)
      .get('/leaderboard')
      .reply(200, leaderboard);

    const store = mockStore({});

    store.dispatch(getLeaderboard())
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.GET_LEADERBOARD_REQUEST });
      expect(success).toEqual({ type: constants.GET_LEADERBOARD_SUCCESS, json: leaderboard });
      done();
    })
    .catch(done);
  });

  it('returns GET_LEADERBOARD_FAILURE when fetching the leaderboard fails', (done) => {
    nock(env.API_ROOT)
      .get('/leaderboard')
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(getLeaderboard())
    .then(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.GET_LEADERBOARD_REQUEST});
      expect(failure).toEqual({ type: constants.GET_LEADERBOARD_FAILURE, error: new Error('request to http://localhost:3000/api/leaderboard failed') });
      done();
    })
    .catch(done)
  });

});
