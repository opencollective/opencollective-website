import { APPEND_DONATION_FORM } from '../../constants/form';

/**
 * Set attributes in the donation form
 */

export default (tiername, attributes) => {
  return {
    type: APPEND_DONATION_FORM,
    tiername,
    attributes
  };
};