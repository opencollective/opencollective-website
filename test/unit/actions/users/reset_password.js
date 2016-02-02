import nock from 'nock';
import mockStore from '../../helpers/mockStore';
import env from '../../../../lib/env';
import * as constants from '../../../../constants/users';

import resetPassword from '../../../../actions/users/reset_password';

describe('users actions', () => {

  afterEach(() => {
    nock.cleanAll();
  });

  describe('reset password', () => {
    const userToken = '123';
    const resetToken = 'abc';
    const password = 'ilovecake';

    it('creates RESET_PASSWORD_SUCCESS if it is successful', (done) => {
      const json = { success: true };

      nock(env.API_ROOT)
        .post(`/users/password/reset/${userToken}/${resetToken}`, {
          password,
          passwordConfirmation: password
        })
        .reply(200, json);

      const expected = [
        { type: constants.RESET_PASSWORD_REQUEST, userToken, resetToken, password },
        { type: constants.RESET_PASSWORD_SUCCESS, userToken, resetToken, password, json },
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(resetPassword(userToken, resetToken, password));
    });

    it('creates RESET_PASSWORD_FAILURE if it fails', (done) => {
      nock(env.API_ROOT)
        .post(`/users/password/reset/${userToken}/${resetToken}`, {
          password,
          passwordConfirmation: password
        })
        .replyWithError('');

      const expected = [
        { type: constants.RESET_PASSWORD_REQUEST, userToken, resetToken, password },
        { type: constants.RESET_PASSWORD_FAILURE,  userToken, resetToken, password, error: new Error()}
      ];

      const store = mockStore({}, expected, done);
      store.dispatch(resetPassword(userToken, resetToken, password));
    });
  });

});
