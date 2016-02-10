import config from 'config';
import path from 'path';
import bust from 'cache-bust';

const dir = path.resolve(__dirname, '../../');

var cache = {};

export default (file) => {
  if (!config.cacheBust) {
    return file;
  }

  if (!cache[file]) {
    // make it a relative path so it hits the static middleware
    cache[file] = bust(dir + file, {remove: true}).replace(dir, '');
  }

  return cache[file];
};