import sizeOf from 'image-size';
import config from 'config';
import request from 'request';
import filterCollection from '../../../frontend/src/lib/filter_collection';
import _ from 'lodash';
import Promise from 'bluebird';
import { getCloudinaryUrl, svg2png } from '../lib/utils';
import queryString from 'query-string';
import url from 'url';
import cachedRequestLib from 'cached-request';

const cachedRequest = cachedRequestLib(request);
cachedRequest.setCacheDirectory('/tmp');
const requestPromise = Promise.promisify(cachedRequest, {multiArgs: true});

export default {

  index: (req, res) => {
    res.render('backers', {
      users: req.users
    });
  },

  markdown: (req, res) => {
    const { slug } = req.params;
    const positions = [];
    const spots = req.params.spots || 30;
    const tiername = req.params.tier || '';

    for (let i=0; i<spots; i++) {
      positions[i] = { position: i };
    }

    let { tiers } = req.group;
    tiers.map(t => {
      t.positions = positions;
    });
    if (tiername) {
      tiers = tiers.filter(t => t.title.toLowerCase() == tiername );
    }

    res.render('bannermd', {
      layout: false,
      base_url: config.host.website,
      tiers,
      slug,
      positions
    })
  },

  js: (req, res) => {
    const { slug } = req.params;
    res.type('application/javascript');
    res.render('bannerjs', {
      layout: false,
      config,
      header: (req.query.header !== 'false'),
      slug
    })
  },

  avatar: (req, res) => {
    const tier = req.params.tier || '';
    const tierSingular = tier.replace(/s$/,'');
    const users = req.users;
    const position = parseInt(req.params.position, 10);
    const user = (position < users.length) ?  users[position] : {};
    const format = req.params.format || 'svg';
    let maxHeight;

    if (req.query.avatarHeight) {
      maxHeight = Number(req.query.avatarHeight);
    } else {
      maxHeight = (format === 'svg' ) ? 128 : 64;
      if (tier.match(/silver/)) maxHeight *= 1.25;
      if (tier.match(/gold/)) maxHeight *= 1.5;
      if (tier.match(/diamond/)) maxHeight *= 2;
    }

    // We only record a page view when loading the first avatar
    if (position==0) {
      req.ga.pageview();
    }

    let imageUrl = "/static/images/user.svg";
    if (user.avatar && user.avatar.substr(0,1) !== '/') {
      if (!tier.match(/sponsor/)) {
        imageUrl = getCloudinaryUrl(user.avatar, { query: `/c_thumb,g_face,h_${maxHeight},r_max,w_${maxHeight},bo_3px_solid_white/c_thumb,h_${maxHeight},r_max,w_${maxHeight},bo_2px_solid_rgb:66C71A/e_trim/f_auto/` });
      } else {
        imageUrl = getCloudinaryUrl(user.avatar, { height: maxHeight });
      }
    }

    if (position == users.length) {
      const btnImage = (tier.match(/sponsor/)) ? 'sponsor' : tierSingular;
      imageUrl = `/static/images/become_${btnImage}.svg`;
    } else if (position > users.length) {
      imageUrl = "/static/images/1px.png";
    }

    if (imageUrl.substr(0,1) === '/') {
      return res.redirect(imageUrl);
    }

    if (format === 'svg') {
      request({url: imageUrl, encoding: null}, (err, r, data) => {
        if (err) {
          return res.status(500).send(`Unable to fetch ${imageUrl}`);
        }
        const contentType = r.headers['content-type'];

        const imageHeight = Math.round(maxHeight / 2);
        let imageWidth = 64;
        if (tier.match(/sponsor/)) {
          try {
            const dimensions = sizeOf(data);
            imageWidth = Math.round(dimensions.width / dimensions.height * imageHeight);
          } catch (e) {
            console.error("Unable to get image dimensions for ", imageUrl);
            return res.status(500).send(`Unable to fetch ${imageUrl}`);
          }
        }

        const base64data = new Buffer(data).toString('base64');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${imageWidth}" height="${imageHeight}">
          <image width="${imageWidth}" height="${imageHeight}" xlink:href="data:${contentType};base64,${base64data}"/>
        </svg>`;
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.setHeader('content-type','image/svg+xml;charset=utf-8');
        return res.send(svg);
      });
    } else {
      req
        .pipe(request(imageUrl))
        .on('error', (e) => {
          console.error("error proxying ", imageUrl, e);
          res.status(500).send(e);
        })
        .on('response', (res) => {
          res.headers['Cache-Control'] = 'public, max-age=300';
        })
        .pipe(res);
    }

  },

  badge: (req, res) => {
    const { tier } = req.params;
    const color = req.query.color || 'brightgreen';
    const { style } = req.query;

    const validator = (user) => (user.tier && user.tier.match(new RegExp(tier.replace(/s$/,''), 'i')));
    const users = _.uniq(filterCollection(req.users, validator), 'id');

    const count = users.length;
    const filename = `${tier}-${count}-${color}.svg`;
    const imageUrl = `https://img.shields.io/badge/${filename}?style=${style}`;

    request(imageUrl, (err, response, body) => {
      if (err) {
        return res.status(500).send(`Unable to fetch ${imageUrl}`);
      }
      res.setHeader('content-type','image/svg+xml;charset=utf-8');
      res.send(body);
    });
  },

  banner: (req, res) => {
    const { order } = req.query;
    const { tier, slug } = req.params;
    let users = req.users;
    const format = req.params.format || 'svg';
    const style = req.query.style || 'rounded';
    const limit = Number(req.query.limit) || Infinity;
    const margin = req.query.margin ? Number(req.query.margin) : 5;
    const imageWidth = Number(req.query.width) || 0;
    const imageHeight = Number(req.query.height) || 0;
    const avatarHeight = Number(req.query.avatarHeight) || 64;
    const count = Math.min(limit, users.length);
    const showBtn = (req.query.button === 'false') ? false : true;

    if (order === 'recent') {
      users = users.sort((a,b) => {
        return (new Date(b.createdAt) - new Date(a.createdAt));
      });
    }

    const params = (style === 'rounded') ? { query: `/c_thumb,g_face,h_${avatarHeight*2},r_max,w_${avatarHeight*2},bo_3px_solid_white/c_thumb,h_${avatarHeight*2},r_max,w_${avatarHeight*2},bo_2px_solid_rgb:66C71A/e_trim/f_auto/` } : { width: avatarHeight * 2, height: avatarHeight * 2};

    const promises = [];
    for (let i = 0 ; i < count ; i++) {
      let avatar = users[i].avatar;
      if (avatar) {
        if (!tier.match(/sponsor/)) {
          avatar = getCloudinaryUrl(avatar, params);
        }
        const options = {url: avatar, encoding: null, ttl: 60 * 60 * 24 * 30 * 1000}; // 30 days caching
        promises.push(requestPromise(options));
      }
    }

    if (showBtn && tier.length > 0) {
      const btnImage = (tier.match(/sponsor/)) ? 'sponsor' : tier.replace(/s$/,'');
      const btn = {
        url: `${config.host.website}/static/images/become_${btnImage}.svg`,
        encoding: null,
        ttl: 60 * 60 * 24 * 30 * 1000
      };

      users.push({
        username: slug,
        website: `${config.host.website}/${slug}#support`
      })

      promises.push(requestPromise(btn));
    }

    let posX = margin;
    let posY = margin;

    Promise.all(promises)
    .then(responses => {
      const images = [];
      for (let i=0;i<responses.length;i++) {
        const { headers } = responses[i][0];
        const rawData = responses[i][1];
        const user = users[i];
        if (!user) continue;

        const contentType = headers['content-type'];
        const website = (user.website && (tier === 'contributors' || tier == 'sponsors')) ? user.website : `${config.host.website}/${user.username}`;
        const base64data = new Buffer(rawData).toString('base64');
        let avatarWidth = avatarHeight;
        try {
          // We make sure the image loaded properly
          const dimensions = sizeOf(rawData);
          avatarWidth = Math.round(dimensions.width / dimensions.height * avatarHeight);
        } catch (e) {
          // Otherwise, we skip it
          console.error(`Cannot get the dimensions of the avatar of ${user.username}`, user.avatar);
          continue;
        }

        if (imageWidth > 0 && posX + avatarWidth + margin > imageWidth) {
          posY += (avatarHeight + margin);
          posX = margin;
        }
        const image = `<image x="${posX}" y="${posY}" width="${avatarWidth}" height="${avatarHeight}" xlink:href="data:${contentType};base64,${base64data}"/>`;
        const imageLink = `<a xlink:href="${website.replace(/&/g,'&amp;')}" target="_blank" id="${user.username}">${image}</a>`;
        images.push(imageLink);
        posX += avatarWidth + margin;
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${imageWidth || posX}" height="${imageHeight || posY + avatarHeight + margin}">
        ${images.join('\n')}
      </svg>`;
    })
    .then(svg => {
      switch (format) {
        case 'svg':
          res.setHeader('content-type','image/svg+xml;charset=utf-8');
          return svg;

        case 'png':
          res.setHeader('content-type','image/png');
          return svg2png(svg)
      }
    })
    .then(svg => {
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.send(svg);
    })
    .catch(e => {
      console.log("Error in generating banner: ", e);
    });
  },

  redirect: (req, res) => {
    const { tier, slug } = req.params;
    const users = req.users;
    const position = parseInt(req.params.position, 10);

    if (position > users.length) {
      return res.sendStatus(404);
    }

    const user = users[position] || {};
    let redirectUrl = `${config.host.website}/${user.username}`;
    if (tier.match(/sponsor/)) {
      user.twitter = user.twitterHandle ? `https://twitter.com/${user.twitterHandle}` : null;
      redirectUrl =  user.website || user.twitter || `${config.host.website}/${user.username}`;
    }

    if (position === users.length) {
      redirectUrl = `${config.host.website}/${slug}#support`;
    }

    const parsedUrl = url.parse(redirectUrl);
    const params = queryString.parse(parsedUrl.query);

    params.utm_source = params.utm_source || 'opencollective';
    params.utm_medium = params.utm_medium || 'github';
    params.utm_campaign = params.utm_campaign || slug;

    parsedUrl.search = `?${queryString.stringify(params)}`;
    redirectUrl = url.format(parsedUrl);

    req.ga.event(`GithubWidget-${tier}`, `Click`, user.name, position);

    res.redirect(redirectUrl);
  }
};
