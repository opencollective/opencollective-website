import fs from 'fs';
import svg_to_png from 'svg-to-png';
import crypto from 'crypto';
import Promise from 'bluebird';
import filterCollection from '../../../frontend/src/lib/filter_collection';
import _ from 'lodash';

const readFile = Promise.promisify(fs.readFile);

export function getCloudinaryUrl(src, { width, height, query }) {

  // We don't try to resize animated gif, svg or images already processed by cloudinary
  if (src.match(/cloudinary.com/) || src.match(/\.gif$/) || (src.match(/\.svg/))) {
    return src;
  }

  let size = '';
  if (width) size += `w_${width},`;
  if (height) size += `h_${height},`;
  if (size === '') size = 'w_320,';

  const format = (src.match(/\.png$/)) ? 'png' : 'jpg';

  const queryurl = query || `/${size}c_fill,f_${format}/`;

  return `https://res.cloudinary.com/opencollective/image/fetch${queryurl}${encodeURIComponent(src)}`;
}

export function filterUsersByTier(users, tiername) {
  if (!tiername) return users;
  return _.uniq(filterCollection(users, { tier: tiername }), 'id');
}

/**
 * Filter users based on:
 * - tier // only users in that tier
 * - exclude // exclude a tier
 * - requireAvatar // skip users who don't have set a custom avatar
 */
export function filterUsers(users, filters) {
  if (!users) return [];
  const { tier, exclude, requireAvatar } = filters;
  const tierSingular = tier && tier.replace(/s$/,'');

  switch (tierSingular) {
    case 'contributor':
      users = Object.keys(users).map(username => {
        const commits = users[username]
        return {
          username,
          avatar: `https://avatars.githubusercontent.com/${username}?s=96`,
          website: `https://github.com/${username}`,
          stats: {c: commits}
        }
      });
      break;
    case 'backer':
    case 'sponsor':
      users = filterUsersByTier(users, tierSingular);
      break;
  }

  if (exclude)
    users = users.filter(u => !u.tier || !u.tier.match(new RegExp(exclude.replace(/s$/,''), 'i')));

  if (requireAvatar)
    users = users.filter(u => u.avatar && !u.avatar.match(/^\//));

  return users;
}

/**
 * Converts an svg string into a PNG data blob
 * (returns a promise)
 */
export function svg2png(svg) {
  const md5 = crypto.createHash('md5').update(svg).digest("hex");
  const svgFilePath = `/tmp/${md5}.svg`;
  const outputDir = `/tmp`;
  const outputFile = `${outputDir}/${md5}.png`;

  try {
    // If file exists, return it
    // Note: because we generate a md5 fingerprint based on the content of the svg,
    //       any change in the svg (margin, size, number of backers, etc.) will force
    //       the creation of a new png :-)
    fs.statSync(outputFile);
    return readFile(outputFile);
  } catch (e) {
    // Otherwise, generate a new png (slow)
    fs.writeFileSync(svgFilePath, svg);

    return svg_to_png.convert(svgFilePath, outputDir)
            .then(() => readFile(outputFile));
  }
}

export default {
  svg2png, filterUsersByTier, getCloudinaryUrl
};
