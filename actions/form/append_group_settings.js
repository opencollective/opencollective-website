import { APPEND_GROUP_SETTINGS_FORM } from '../../constants/form';

/**
 * Append field in group settings form
 */

export default (attributes) => {
  return {
    type: APPEND_GROUP_SETTINGS_FORM,
    attributes,
  };
};

