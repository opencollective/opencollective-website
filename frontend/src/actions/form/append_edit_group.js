import { APPEND_EDIT_GROUP_FORM } from '../../constants/form';

/**
 * Append field in edit group form
 */

export default (attributes) => {
  return {
    type: APPEND_EDIT_GROUP_FORM,
    attributes,
  };
};

