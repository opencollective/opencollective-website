import nock from 'nock';
import expect from 'expect';

import mockStore from '../../helpers/mockStore';
import env from '../../../../frontend/src/lib/env';
import donate from '../../../../frontend/src/actions/groups/donate';
import * as constants from '../../../../frontend/src/constants/groups';

describe('groups/donate', () => {

  afterEach(() => nock.cleanAll());

  it('creates DONATE_GROUP_SUCCESS when fetching a group is done', (done) => {
    const payment = {
      amount: 10,
      stripeToken: 'tok_123'
    };

    nock(env.API_ROOT)
      .post('/groups/1/donations/')
      .reply(200, payment);

    const store = mockStore({});

    store.dispatch(donate(1, payment))
    .then(() => {
      const [request, success] = store.getActions();
      expect(request).toEqual({ type: constants.DONATE_GROUP_REQUEST, id: 1, payment });
      expect(success).toEqual({ type: constants.DONATE_GROUP_SUCCESS, id: 1, json: payment });
      done();
    })
    .catch(done)
  });

  it('creates DONATE_GROUP_FAILURE when donating fails', (done) => {
    const payment = {
      amount: 10,
      stripeToken: 'tok_123'
    };

    nock(env.API_ROOT)
      .post('/groups/1/donations/')
      .replyWithError('');

    const store = mockStore({});

    store.dispatch(donate(1, payment))
    .catch(() => {
      const [request, failure] = store.getActions();
      expect(request).toEqual({ type: constants.DONATE_GROUP_REQUEST, id: 1, payment });
      expect(failure.type).toEqual(constants.DONATE_GROUP_FAILURE);
      expect(failure.error.message).toContain('request to http://localhost:3000/api/groups/1/donations/ failed, reason:');
      done();
    });
  });

  // it.only('redirects user if the donation is via paypal', (done) => {
  //   const payment = {
  //     amount: 10
  //   };

  //   const reponse = {
  //     links: [{
  //       method: 'REDIRECT',
  //       rel: 'approval_url',
  //       href: 'paypal.com/something'
  //     }]
  //   };

  //   const json = payment;
  //   nock(env.API_ROOT)
  //     .post('/groups/1/payments/paypal')
  //     .reply(200, reponse);

  //   const expected = [
  //     { type: constants.DONATE_GROUP_REQUEST, id: 1, payment },
  //     { type: constants.DONATE_GROUP_SUCCESS, id: 1, json }
  //   ];
  //   const store = mockStore({}, expected, done);
  //   store.dispatch(donate(1, payment, { paypal: true }));
  // });

});
