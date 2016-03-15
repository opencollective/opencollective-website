import { APPEND_TRANSACTION_FORM } from '../../constants/form';

/**
 * Append field in transaction form
 */

export default (attributes) => {
  return {
    type: APPEND_TRANSACTION_FORM,
    attributes,
  };
};
