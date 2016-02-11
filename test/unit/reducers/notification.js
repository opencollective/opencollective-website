import expect from 'expect';
import reducer from '../../../frontend/src/reducers/notification';
import { NOTIFY } from '../../../frontend/src/constants/notification';


describe('notification reducer', () => {

  it('should save the notification', () => {
    const notification = {
      message: 'Yo',
      status: 'error'
    };

    expect(reducer({}, {
      ...notification,
      type: NOTIFY
    }))
    .toEqual(notification);
  });

});
