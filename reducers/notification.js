import { NOTIFY, RESET_NOTIFICATIONS } from '../constants/notification';

export default function notification(state={}, action={}) {
  switch (action.type) {
    case NOTIFY:
      return {
        status: action.status,
        message: action.message
      };

    case RESET_NOTIFICATIONS:
      return {};

    default:
      return state;
  }
}
