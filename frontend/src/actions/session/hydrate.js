import { HYDRATE } from '../../constants/session';

/**
 * Hydrate the app
 */

export default (data) => {

  return {
    type: HYDRATE,
    data
  };
};
