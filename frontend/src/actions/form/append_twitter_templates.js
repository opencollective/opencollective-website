import { APPEND_TWITTER_TEMPLATES_FORM } from '../../constants/form';

/**
 * Append field in twitter templates form
 */

export default (attributes) => {
  return {
    type: APPEND_TWITTER_TEMPLATES_FORM,
    attributes
  };
};
