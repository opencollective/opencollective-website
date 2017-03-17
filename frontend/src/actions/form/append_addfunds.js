import { APPEND_ADDFUNDS_FORM } from '../../constants/form';

/**
 * Append field in expense form
 */

export default (attributes) => {
  return {
    type: APPEND_ADDFUNDS_FORM,
    attributes
  };
};
