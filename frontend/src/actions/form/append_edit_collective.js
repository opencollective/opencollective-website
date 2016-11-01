import { APPEND_EDIT_COLLECTIVE_FORM } from '../../constants/form';

/**
 * Append field in edit collective form
 */

export default (attributes) => {
  return {
    type: APPEND_EDIT_COLLECTIVE_FORM,
    attributes,
  };
};

