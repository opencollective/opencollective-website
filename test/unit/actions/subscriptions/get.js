import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import getSubscriptions from '../../../../frontend/src/actions/subscriptions/get';
import * as constants from '../../../../frontend/src/constants/subscriptions';

describe('subscriptions/get', () => {

  afterEach(() => nock.cleanAll());

  it('dispatches GET_SUBSCRIPTIONS_SUCCESS', (done) => {
    const subscriptions = [{id: 1}];

    nock(env.API_ROOT)
      .get(`/subscriptions`)
      .reply(200, subscriptions);

    const store = mockStore({});

    store.dispatch(getSubscriptions())
      .then(() => {
        const [request, success] = store.getActions();

        expect(request).toEqual({ type: constants.GET_SUBSCRIPTIONS_REQUEST });
        expect(success).toEqual({ type: constants.GET_SUBSCRIPTIONS_SUCCESS, subscriptions });
        done();
      })
      .catch(done);
  });

 it('dispatches GET_SUBSCRIPTIONS_FAILURE when it fails', (done) => {

    nock(env.API_ROOT)
      .get(`/subscriptions`)
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(getSubscriptions())
      .then(() => {
        const [request, failure] = store.getActions();

        expect(request).toEqual({ type: constants.GET_SUBSCRIPTIONS_REQUEST });
        expect(failure.type).toEqual(constants.GET_SUBSCRIPTIONS_FAILURE);
        expect(failure.error.message).toContain('request to http://localhost:3000/api/subscriptions failed');
        done();
      })
      .catch(done);
  });

});
