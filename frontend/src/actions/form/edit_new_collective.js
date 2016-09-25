import { EDIT_COLLECTIVE_FORM } from '../../constants/form';

/**
 * Edit new collective form
 */

export default (attributes) => {
  return {
    type: EDIT_COLLECTIVE_FORM,
    attributes,
  };
};