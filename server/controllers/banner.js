import sizeOf from 'image-size';
import config from 'config';
import request from 'request';
import filterCollection from '../../frontend/src/lib/filter_collection';
import _ from 'lodash';
import Promise from 'bluebird';
import utils from '../lib/utils';

const filterUsersByTier = (users, tiername) => {
  return _.uniq(filterCollection(users, { tier: tiername }), 'id');
}

module.exports = {

  index: (req, res) => {
    res.render('backers', {
      users: req.users
    });
  },

  markdown: (req, res) => {
    const slug = req.params.slug;
    const positions = [];
    const spots = req.params.spots || 30;
    const tiername = req.params.tier || '';

    for(var i=0; i<spots; i++) {
      positions[i] = { position: i };
    }

    var tiers = req.group.tiers;
    tiers.map(t => { t.positions = positions; });
    if(tiername) {
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

  avatar: (req, res) => {
    const tier = req.params.tier || '';
    const tierSingular = tier.replace(/s$/,'');
    const users = filterUsersByTier(req.users, tierSingular);
    const position = parseInt(req.params.position, 10);
    const user = (position < users.length) ?  users[position] : {};
    const format = req.params.format || 'svg';

    var maxHeight = (format === 'svg' ) ? 128 : 64;
    if(tier.match(/silver/)) maxHeight *= 1.25;
    if(tier.match(/gold/)) maxHeight *= 1.5;
    if(tier.match(/diamond/)) maxHeight *= 2;

    // We only record a page view when loading the first avatar
    if(position==0) {
      req.ga.pageview();
    }

    var imageUrl = "/static/images/user.svg";
    if(user.avatar && user.avatar.substr(0,1) !== '/') {
      const avatarEncoded = encodeURIComponent(user.avatar);
      if (!tier.match(/sponsor/)) {
        imageUrl = `https://res.cloudinary.com/opencollective/image/fetch/c_thumb,g_face,h_${maxHeight},r_max,w_${maxHeight},bo_3px_solid_white/c_thumb,h_${maxHeight},r_max,w_${maxHeight},bo_2px_solid_rgb:66C71A/e_trim/f_auto/${avatarEncoded}`;
      }
      else {
        imageUrl = `https://res.cloudinary.com/opencollective/image/fetch/h_${maxHeight}/${avatarEncoded}`;
      }
    }

    if(position == users.length) {
      const btnImage = (tier.match(/sponsor/)) ? 'sponsor' : tierSingular;
      imageUrl = `/static/images/become_${btnImage}.svg`;
    }
    else if(position > users.length) {
      imageUrl = "/static/images/1px.png";
    }

    if(imageUrl.substr(0,1) === '/') {
      return res.redirect(imageUrl);
    }

    if(format === 'svg') {
      request({url: imageUrl, encoding: null}, (e, r, data) => {
        const contentType = r.headers['content-type'];

        const imageHeight = Math.round(maxHeight / 2);
        let imageWidth = 64;
        if (tier.match(/sponsor/)) {
          const dimensions = sizeOf(data);
          imageWidth = Math.round(dimensions.width / dimensions.height * imageHeight);
        }

        const base64data = new Buffer(data).toString('base64');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${imageWidth}" height="${imageHeight}">
          <image width="${imageWidth}" height="${imageHeight}" xlink:href="data:${contentType};base64,${base64data}"/>
        </svg>`;
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.setHeader('content-type','image/svg+xml;charset=utf-8');
        return res.send(svg);
      });
    }
    else {
      req
        .pipe(request(imageUrl))
        .on('response', (res) => {
          res.headers['Cache-Control'] = 'public, max-age=300';
        })
        .pipe(res);
    }

  },

  badge: (req, res) => {
    const tier = req.params.tier;
    const color = req.query.color || 'brightgreen';
    const style = req.query.style;

    const users = filterUsersByTier(req.users, tier.replace(/s$/,''));
    const count = users.length;
    const filename = `${tier}-${count}-${color}.svg`;
    const imageUrl = `https://img.shields.io/badge/${filename}?style=${style}`;

    request(imageUrl, (err, response, body) => {
      res.setHeader('content-type','image/svg+xml;charset=utf-8');
      res.send(body);
    });
  },

  banner: (req, res) => {
    const tier = req.params.tier;
    const format = req.params.format || 'svg';
    const margin = req.query.margin ? Number(req.query.margin) : 5;
    const imageWidth = Number(req.query.width) || 0;
    const imageHeight = Number(req.query.height) || 0;
    const avatarHeight = Number(req.query.avatarHeight) || 64;
    const users = filterUsersByTier(req.users, tier.replace(/s$/,''));
    const count = users.length;

    const promises = [];
    const requestPromise = Promise.promisify(request, {multiArgs: true});
    for(var i=0; i<count; i++) {
      if(users[i].avatar) {
        if(!tier.match(/sponsor/)) {
          users[i].avatar = `https://res.cloudinary.com/opencollective/image/fetch/c_thumb,g_face,h_${avatarHeight*2},r_max,w_${avatarHeight*2},bo_3px_solid_white/c_thumb,h_${avatarHeight*2},r_max,w_${avatarHeight*2},bo_2px_solid_rgb:66C71A/e_trim/f_auto/${encodeURIComponent(users[i].avatar)}`;
        }
        var options = {url: users[i].avatar, encoding: null};
        promises.push(requestPromise(options));
      }
    }

    var posX = 0;
    var posY = 0;

    Promise.all(promises)
    .then(responses => {
      const images = [];
      for(var i=0;i<responses.length;i++) {
        const headers = responses[i][0].headers;
        const rawData = responses[i][1];

        const contentType = headers['content-type'];
        const website = users[i].website;
        const base64data = new Buffer(rawData).toString('base64');

        var avatarWidth = avatarHeight;
        if (tier.match(/sponsor/)) {
          try {
            const dimensions = sizeOf(rawData);
            avatarWidth = Math.round(dimensions.width / dimensions.height * avatarHeight);
          } catch(e) {
            console.error(`Cannot get the dimensions of the avatar of ${users[i].name}`, users[i].avatar);
            continue;
          }
        }
        if(imageWidth > 0 && posX + avatarWidth + margin > imageWidth) {
          posY += (avatarHeight + margin);
          posX = 0;
        }
        var image = `<image x="${posX}" y="${posY}" width="${avatarWidth}" height="${avatarHeight}" xlink:href="data:${contentType};base64,${base64data}"/>`;
        if(website) {
          image = `<a xlink:href="${website.replace(/&/g,'&amp;')}">${image}</a>`;
        }
        images.push(image);
        posX += avatarWidth + margin;
      };

      return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${imageWidth || (posX - margin)}" height="${imageHeight || posY + avatarHeight}">
        ${images.join('\n')}
      </svg>`;
    })
    .then(svg => {
      switch(format) {
        case 'svg':
          res.setHeader('content-type','image/svg+xml;charset=utf-8');
          return svg;

        case 'png':
          res.setHeader('content-type','image/png');
          return utils.svg2png(svg)
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
    const tier = req.params.tier;
    const users = filterUsersByTier(req.users, tier.replace(/s$/,''));
    const slug = req.params.slug;
    const position = parseInt(req.params.position, 10);

    if (position > users.length) {
      return res.sendStatus(404);
    }

    const user = users[position] || {};
    user.twitter = user.twitterHandle ? `https://twitter.com/${user.twitterHandle}` : null;

    var redirectUrl =  user.website || user.twitter || `https://opencollective.com/${slug}`;
    if(position === users.length) {
      redirectUrl = `https://opencollective.com/${slug}#support`;
    }

    req.ga.event(`GithubWidget-${tier}`, `Click`, user.name, position);

    res.redirect(redirectUrl);
  }
};
