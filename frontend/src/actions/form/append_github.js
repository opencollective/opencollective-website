import { APPEND_GITHUB_FORM } from '../../constants/form';

/**
 * Append field in github form
 */

export default (attributes) => {
  return {
    type: APPEND_GITHUB_FORM,
    attributes,
  };
};

