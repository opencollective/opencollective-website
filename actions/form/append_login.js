import { APPEND_LOGIN_FORM } from '../../constants/form';

/**
 * Append field in login form
 */

export default (attributes) => {
  return {
    type: APPEND_LOGIN_FORM,
    attributes,
  };
};
