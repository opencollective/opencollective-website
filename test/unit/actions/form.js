import expect from 'expect';
import appendDonation from '../../../actions/form/append_donation';
import * as constants from '../../../constants/form';

describe('form actions', () => {

  describe('donation', () => {
    it('should set append a field to the donation form', () => {
      const attributes = { amount: 10 };

      expect(appendDonation(attributes)).toEqual({
        type: constants.APPEND_DONATION_FORM,
        attributes
      });
    });

  });

});
