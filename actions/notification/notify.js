import { NOTIFY } from '../../constants/notification';

/**
 * Send notification
 */

export default (status, message) => {
  return {
    type: NOTIFY,
    status,
    message
  };
};
