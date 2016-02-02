import { APPEND_PROFILE_FORM } from '../../constants/form';

/**
 * Append field in profile form
 */

export default (attributes) => {
  return {
    type: APPEND_PROFILE_FORM,
    attributes,
  };
};

