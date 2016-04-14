import AVATARS from '../constants/default_avatars';
const AVATARS_LENGTH = AVATARS.length;

export default(baseString) => {
  let crc = 0;
  const stringLength = baseString.length;

  for (let i = 0; i < stringLength; i++) {
    crc += baseString[i].charCodeAt(0);
  }

  return AVATARS[crc % AVATARS_LENGTH];
};
