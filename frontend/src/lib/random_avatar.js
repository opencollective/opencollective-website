import AVATARS from '../constants/default_avatars';
let avatars = AVATARS.slice();

export default () => {
  const index = Math.floor(Math.random() * avatars.length);
  const avatar = avatars[index];

  avatars.splice(index, 1);

  if (avatars.length === 0) {
    avatars = AVATARS.slice();
  }

  return avatar;
};
