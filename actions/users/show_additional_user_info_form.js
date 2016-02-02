import { SHOW_ADDITIONAL_USER_INFO_FORM } from '../../constants/users';

/**
 * Show additional form to collect user info after donation
 */

export default () => {
  return {
    type: SHOW_ADDITIONAL_USER_INFO_FORM,
  };
};

