import config from 'config';
import path from 'path';
import bust from 'cache-bust';

const dir = path.resolve(__dirname, '../../../../frontend/dist/');

const cache = {};

export default (file) => {
  if (!config.cacheBust) {
    return `${config.host.website}/static${file}`;
  }

  if (!cache[file]) {
    // make it a relative path so it hits the static middleware
    console.log("BUSTING: ", dir + file);
    cache[file] = bust(dir + file, {remove: true}).replace(dir, `${config.host.website}/static`);
  }

  return cache[file];
};
