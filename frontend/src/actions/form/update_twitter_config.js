import { APPEND_TWITTER_CONFIG_FORM } from '../../constants/form';

/**
 * Append field in twitter config form
 */

export default (attributes) => {
  return {
    type: APPEND_TWITTER_CONFIG_FORM,
    attributes
  };
};
