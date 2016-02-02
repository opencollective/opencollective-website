import {
  SHOW_POPOVERMENU
} from '../../constants/session';


/**
 * Show hide popover menu
 */

export default (hasPopOverMenuOpen) => ({
  type: SHOW_POPOVERMENU,
  hasPopOverMenuOpen
});
