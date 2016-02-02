import { SET_EDIT_MODE_PROFILE } from '../../constants/form';

/**
 * Set edit mode profile form
 */

export default (isEditMode) => {
  return {
    type: SET_EDIT_MODE_PROFILE,
    isEditMode
  };
};

