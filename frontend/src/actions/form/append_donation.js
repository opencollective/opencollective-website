import { APPEND_DONATION_FORM } from '../../constants/form';

/**
 * Set attributes in the donation form
 */

export default (attributes) => {
  return {
    type: APPEND_DONATION_FORM,
    attributes,
  };
};

