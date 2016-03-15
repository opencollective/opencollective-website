import expect from 'expect';
import appendProfile from '../../../../frontend/src/actions/form/append_profile';
import * as constants from '../../../../frontend/src/constants/form';

describe('form/append_profile', () => {

  it('should set append a field to the profile form', () => {
    const attributes = { name: 'Lucy' };

    expect(appendProfile(attributes)).toEqual({
      type: constants.APPEND_PROFILE_FORM,
      attributes
    });
  });

});
