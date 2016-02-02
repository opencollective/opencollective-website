import nock from 'nock';
import mockStore from '../../helpers/mockStore';
import env from '../../../../lib/env';
import * as constants from '../../../../constants/users';

import getPreapprovalKeyForUser from '../../../../actions/users/get_preapproval_key';
import confirmPreapprovalKey from '../../../../actions/users/confirm_preapproval_key';
import fetchUserIfNeeded from '../../../../actions/users/fetch_by_id_cached';
import fetchUserGroups from '../../../../actions/users/fetch_groups';
import fetchCards from '../../../../actions/users/fetch_cards';
import updatePaypalEmail from '../../../../actions/users/update_paypal_email';

describe('users actions', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('preapproval per user', () => {

    it('creates GET_APPROVAL_KEY_FOR_USER_SUCCESS if it is successful', (done) => {
      const userid = 1;
      const json = { preapprovalKey: 'abc' };
      nock(env.API_ROOT)
        .get(`/users/${userid}/paypal/preapproval`)
        .query(true) // match all query params
        .reply(200, json);

      const expected = [
        { type: constants.GET_APPROVAL_KEY_FOR_USER_REQUEST, userid },
        { type: constants.GET_APPROVAL_KEY_FOR_USER_SUCCESS, userid, json },
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(getPreapprovalKeyForUser(userid));
    });

    it('creates GET_APPROVAL_KEY_FOR_USER_FAILURE if it fails', (done) => {
      const userid = 1;

      nock(env.API_ROOT)
        .get(`/users/${userid}/paypal/preapproval`)
        .query(true) // match all query params
        .replyWithError('');

      const expected = [
        { type: constants.GET_APPROVAL_KEY_FOR_USER_REQUEST, userid },
        { type: constants.GET_APPROVAL_KEY_FOR_USER_FAILURE, error: new Error('request to http://localhost:3000/api/users/1/paypal/preapproval?cancelUrl=about%3A%2F%2Fblank%3FapprovalStatus%3Dcancel&maxTotalAmountOfAllPayments=2000&returnUrl=about%3A%2F%2Fblank%3FapprovalStatus%3Dsuccess%26preapprovalKey%3D%24%7BpreapprovalKey%7D failed') }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(getPreapprovalKeyForUser(userid));
    });
  });

 describe('confirm preapproval per user', () => {

    it('creates CONFIRM_APPROVAL_KEY_SUCCESS if it is successful', (done) => {
      const userid = 1;
      const preapprovalKey = 'abc';
      const json = { id: 3 };

      nock(env.API_ROOT)
        .post(`/users/${userid}/paypal/preapproval/${preapprovalKey}`)
        .reply(200, json);

      const expected = [
        { type: constants.CONFIRM_APPROVAL_KEY_REQUEST, userid, preapprovalKey },
        { type: constants.CONFIRM_APPROVAL_KEY_SUCCESS, userid, preapprovalKey, json }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(confirmPreapprovalKey(userid, preapprovalKey));
    });

    it('creates CONFIRM_APPROVAL_KEY_FAILURE if it fails', (done) => {
      const userid = 1;
      const preapprovalKey = 'abc';

      nock(env.API_ROOT)
        .post(`/users/${userid}/paypal/preapproval/${preapprovalKey}`)
        .replyWithError('');

      const expected = [
        { type: constants.CONFIRM_APPROVAL_KEY_REQUEST, userid, preapprovalKey },
        { type: constants.CONFIRM_APPROVAL_KEY_FAILURE, error: new Error('request to http://localhost:3000/api/users/1/paypal/preapproval?cancelUrl=about%3A%2F%2Fblank%3FapprovalStatus%3Dcancel&maxTotalAmountOfAllPayments=2000&returnUrl=about%3A%2F%2Fblank%3FapprovalStatus%3Dsuccess%26preapprovalKey%3D%24%7BpreapprovalKey%7D failed') }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(confirmPreapprovalKey(userid, preapprovalKey));
    });
  });

  describe('fetch user if needed', () => {

    it('should not fetch if the user is already in the store', (done) => {
      const user = { id: 1 };
      const state = {
        users: {
          [user.id]: user
        }
      };
      const expected = [{ type: constants.FETCH_USER_FROM_STATE, user }];

      const store = mockStore(state, expected, done);
      store.dispatch(fetchUserIfNeeded(user.id));
    });

    it('should fetch the user if it is not in the state', (done) => {
      const id = 1;
      const user = { id };
      const users = { [id]: user };

      nock(env.API_ROOT)
        .get(`/users/${id}`)
        .reply(200, user);

      const expected = [
        { type: constants.FETCH_USER_REQUEST, id: id },
        { type: constants.FETCH_USER_SUCCESS, id: id, users }
      ];

      const store = mockStore({ users: {} }, expected, done);
      store.dispatch(fetchUserIfNeeded(user.id));
    });

    it('creates FETCH_USER_FAILURE if it fails', (done) => {
      const id = 1;

      nock(env.API_ROOT)
        .get(`/users/${id}`)
        .replyWithError('');

      const expected = [
        { type: constants.FETCH_USER_REQUEST, id: id },
        { type: constants.FETCH_USER_FAILURE, error: new Error('request to http://localhost:3000/api/users/1 failed') }
      ];

      const store = mockStore({ users: {} }, expected, done);
      store.dispatch(fetchUserIfNeeded(id));
    });
  });

  describe('fetch user groups', () => {

    it('creates USER_GROUPS_SUCCESS if it successfully fetches groups', (done) => {
      const userid = 1;
      const reponse = [
        { id: 2 },
        { id: 3 }
      ];
      const groups = {
        2: { id: 2 },
        3: { id: 3 }
      };

      nock(env.API_ROOT)
        .get(`/users/${userid}/groups`)
        .query(true) // match all query params
        .reply(200, reponse);

      const expected = [
        { type: constants.USER_GROUPS_REQUEST, userid },
        { type: constants.USER_GROUPS_SUCCESS, userid, groups }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(fetchUserGroups(userid));
    });

    it('creates USER_GROUPS_FAILURE if it fails', (done) => {
      const userid = 1;

      nock(env.API_ROOT)
        .get(`/users/${userid}/groups`)
        .replyWithError('');

      const expected = [
        { type: constants.USER_GROUPS_REQUEST, userid },
        { type: constants.USER_GROUPS_FAILURE, error: new Error('request to http://localhost:3000/api/users/1/groups?include=usergroup.role failed') }
      ];

      const store = mockStore({}, expected, done, true);
      store.dispatch(fetchUserGroups(userid));
    });
  });

  describe('update paypal email', () => {

    it('creates UPDATE_PAYPAL_EMAIL_SUCCESS if it successfully updates email', (done) => {
      const userid = 1;
      const paypalEmail = 'paypal@email.com';
      const response = {
        id: userid,
        paypalEmail
      };

      nock(env.API_ROOT)
        .put(`/users/${userid}/paypalemail`, { paypalEmail })
        .reply(200, response);

      const expected = [
        {
          type: constants.UPDATE_PAYPAL_EMAIL_REQUEST,
          userid,
          paypalEmail
        },
        {
          type: constants.UPDATE_PAYPAL_EMAIL_SUCCESS,
          userid,
          paypalEmail,
          json: response
        }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(updatePaypalEmail(userid, paypalEmail));
    });

    it('creates UPDATE_PAYPAL_EMAIL_FAILURE if it fails', (done) => {
      const userid = 1;
      const paypalEmail = 'paypal@email.com';

      nock(env.API_ROOT)
        .put(`/users/${userid}/paypalemail`, { paypalEmail })
        .replyWithError('');

      const expected = [
        { type: constants.UPDATE_PAYPAL_EMAIL_REQUEST, userid, paypalEmail },
        { type: constants.UPDATE_PAYPAL_EMAIL_FAILURE, error: new Error('request to http://localhost:3000/api/users/1/paypalemail failed') }
      ];

      const store = mockStore({}, expected, done, true);
      store.dispatch(updatePaypalEmail(userid, paypalEmail));
    });
  });

  describe('fetch user cards', () => {

    it('creates USER_CARDS_SUCCESS if it successfully fetches cards', (done) => {
      const userid = 1;
      const reponse = [
        { id: 2 },
        { id: 3 }
      ];
      const cards = {
        2: { id: 2 },
        3: { id: 3 }
      };

      nock(env.API_ROOT)
        .get(`/users/${userid}/cards`)
        .reply(200, reponse);

      const expected = [
        { type: constants.USER_CARDS_REQUEST, userid },
        { type: constants.USER_CARDS_SUCCESS, userid, cards }
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(fetchCards(userid));
    });

    it('creates USER_CARDS_FAILURE if it fails', (done) => {
      const userid = 1;

      nock(env.API_ROOT)
        .get(`/users/${userid}/cards`)
        .replyWithError('');

      const expected = [
        { type: constants.USER_CARDS_REQUEST, userid },
        { type: constants.USER_CARDS_FAILURE, error: new Error('request to http://localhost:3000/api/users/1/cards failed') }
      ];

      const store = mockStore({}, expected, done, true);
      store.dispatch(fetchCards(userid));
    });
  });
});
