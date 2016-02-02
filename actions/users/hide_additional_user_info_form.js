import { HIDE_ADDITIONAL_USER_INFO_FORM } from '../../constants/users';

/**
 * Hide additional form to collect user info after donation
 */

export default () => {
  return {
    type: HIDE_ADDITIONAL_USER_INFO_FORM,
  };
};

