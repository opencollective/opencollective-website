import config from 'config';
import path from 'path';
import bust from 'cache-bust';

const dir = path.resolve(__dirname, '../../../../frontend/dist/');

const cache = {};

export default (file) => {
  if (!config.cacheBust) {
    return `/static${file}`;
  }

  if (!cache[file]) {
    // make it a relative path so it hits the static middleware
    cache[file] = bust(dir + file, {remove: true}).replace(dir, `/static`);
  }

  return cache[file];
};
