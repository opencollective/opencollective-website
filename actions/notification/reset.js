import { RESET_NOTIFICATIONS } from '../../constants/notification';

/**
 * Reset notifications, will be called on each page change
 */

export default () => {
  return {
    type: RESET_NOTIFICATIONS
  };
};
