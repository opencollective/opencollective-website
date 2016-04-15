import AVATARS from '../constants/default_avatars';
const AVATARS_LENGTH = AVATARS.length;

export default(num = 0) => {
  return AVATARS[num % AVATARS_LENGTH];
};
