import sizeOf from 'image-size';
import config from 'config';
import request from 'request';
import filterCollection from '../../frontend/src/lib/filter_collection';
import _ from 'lodash';

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

    // We only record a page view when loading the first avatar
    if(position==0) {
      req.ga.pageview();
    }

    var imageUrl = "/static/images/user.svg";
    if(user.avatar) {
      const avatarEncoded = encodeURIComponent(user.avatar);
      const maxHeight = (format === 'svg' ) ? 128 : 64;
      imageUrl = `https://res.cloudinary.com/opencollective/image/fetch/h_${maxHeight}/${avatarEncoded}`;
    }
    
    if(position == users.length) {
      imageUrl = `/static/images/become_${tierSingular}.svg`;
    }
    else if(position > users.length) {
      imageUrl = "/static/images/1px.png";
    }

    if(imageUrl.substr(0,1) == '/') {
      return res.redirect(imageUrl);
    }

    if(format === 'svg') {
      request({url: imageUrl, encoding: null}, (e, r, data) => {
        const contentType = r.headers['content-type'];

        const imageHeight = 64;
        let imageWidth = 64;
        if (tier === 'sponsor') {
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
    const users = filterUsersByTier(req.users, tier.replace(/s$/,''));
    const count = users.length;
    const filename = `${tier}-${count}-brightgreen.svg`;
    const imageUrl = `https://img.shields.io/badge/${filename}`;

    request(imageUrl, (err, response, body) => {
      res.setHeader('content-type','image/svg+xml;charset=utf-8');
      res.send(body);
    });
  },

  redirect: (req, res) => {
    const tier = req.params.tier;
    const users = filterUsersByTier(req.users, tier.replace(/s$/,''));
    const slug = req.params.slug;
    const position = parseInt(req.params.position, 10);
    const user = (position < users.length) ?  users[position] : {};
    user.twitter = (user.twitterHandle) ? `https://twitter.com/${user.twitterHandle}` : null;

    var redirectUrl = user.website || user.twitter || `https://opencollective.com/${slug}`;
    if(position === users.length) {
      redirectUrl = `https://opencollective.com/${slug}#support`;
    }

    req.ga.pageview();
    req.ga.event(`GithubWidget-${tier}`, `Click`, user.name, position);

    res.redirect(redirectUrl);      
  }
};
