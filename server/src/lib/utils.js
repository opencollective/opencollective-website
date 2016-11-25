import fs from 'fs';
import svg_to_png from 'svg-to-png';
import crypto from 'crypto';
import Promise from 'bluebird';
import filterCollection from '../../../frontend/src/lib/filter_collection';
import _ from 'lodash';

const readFile = Promise.promisify(fs.readFile);

export function getCloudinaryUrl(src, { width, height, query }) {
  const cloudinaryBaseUrl = 'https://res.cloudinary.com/opencollective/image/fetch';

  // We don't try to resize animated gif, svg or images already processed by cloudinary
  if (src.substr(0, cloudinaryBaseUrl.length) === cloudinaryBaseUrl || src.match(/\.gif$/) || (src.match(/\.svg/)) || src.match(/localhost\:3000/)) {
    return src;
  }

  let size = '';
  if (width) size += `w_${width},`;
  if (height) size += `h_${height},`;
  if (size === '') size = 'w_320,';

  const format = (src.match(/\.png$/)) ? 'png' : 'jpg';

  const queryurl = query || `/${size}c_fill,f_${format}/`;

  return `${cloudinaryBaseUrl}${queryurl}${encodeURIComponent(src)}`;
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
  let index = 0;

  // Used to sort users by tier
  const rank = (tier) => {
    const pos = {
      'member': 1,
      'core contributor': 1,
      'backer': 2,
      'sponsor': 3,
      'contributor': 4
    }
    return pos[tier] || 5;
  }

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
    case 'member':
      users = users.filter(u => u.role !== 'HOST');
      users = users.map(u => {
        u.index = index++;
        return u;
      })
      // We sort by tier (make sure "core contributors" show first)
      users.sort((a, b) => {
        if (rank(a.tier) > rank(b.tier)) return 1;
        if (rank(a.tier) < rank(b.tier)) return -1;
        return a.index - b.index; // make sure we keep the original order within a tier (typically totalDonations DESC)
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