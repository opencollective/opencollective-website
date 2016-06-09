import { APPEND_EXPENSE_FORM } from '../../constants/form';

/**
 * Append field in expense form
 */

export default (attributes) => {
  return {
    type: APPEND_EXPENSE_FORM,
    attributes
  };
};
