import { APPEND_GROUP_FORM } from '../../constants/form';

/**
 * Append field in github form
 */

export default (attributes) => {
  return {
    type: APPEND_GROUP_FORM,
    attributes,
  };
};

