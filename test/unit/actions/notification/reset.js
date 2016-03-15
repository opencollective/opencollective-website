import expect from 'expect';

import reset from '../../../../frontend/src/actions/notification/reset';
import { RESET_NOTIFICATIONS } from '../../../../frontend/src/constants/notification';

describe('notification/reset', () => {

  it('return RESET_NOTIFICATIONS', () => {
    expect(reset()).toEqual({ type: RESET_NOTIFICATIONS });
  });

});
