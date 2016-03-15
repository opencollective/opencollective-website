import expect from 'expect';
import appendDonation from '../../../../frontend/src/actions/form/append_donation';
import * as constants from '../../../../frontend/src/constants/form';

describe('form/append_donation', () => {

  it('should set append a field to the donation form', () => {
    const tiername = 'backer';
    const attributes = { amount: 10, frequency: 'month', currency: 'MXN' };

    expect(appendDonation(tiername, attributes)).toEqual({
      type: constants.APPEND_DONATION_FORM,
      tiername,
      attributes
    });
  });

});
