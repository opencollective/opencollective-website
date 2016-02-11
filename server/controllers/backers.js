const config = require('config');
const request = require('request');

module.exports = {
  
  index: (req, res) => {
    res.render('backers', {
      users: req.users
    });
  },
  
  banner: (req, res) => {
    const slug = req.params.slug;
    const positions = [];
    const spots = req.params.spots || 10;
    
    for(var i=0; i<spots; i++) {
      positions[i] = { position: i };
    }
    
    res.render('bannermd', {
      layout: false,
      base_url: config.host.website,
      slug,
      positions
    })
  },
  
  avatar: (req, res) => {
    const users = req.users;
    const position = parseInt(req.params.position, 10);
        
    const user = (position < users.length) ?  users[position] : {};
    
    var imageUrl = "/static/images/avatar_placeholder.jpg";
    if(user.avatar) {
      imageUrl = `https://res.cloudinary.com/opencollective/image/fetch/h_64/${user.avatar}`;
    }
    
    if(position == users.length)
      imageUrl = "/static/images/becomeASponsor.png";
    if(position > users.length)
      imageUrl = "/static/images/1px.png";

    if(imageUrl.substr(0,1) === '/')    
      return res.redirect(imageUrl);
    else {
      req
        .pipe(request(imageUrl))
        .pipe(res);
    }

  },
  
  redirect: (req, res) => {
    const users = req.users;
    const slug = req.params.slug;
    const position = parseInt(req.params.position, 10);
        
    const user = (position < users.length) ?  users[position] : {};
    user.twitter = (user.twitterHandle) ? `https://twitter.com/${user.twitterHandle}` : null;
    
    var redirectUrl = user.website || user.twitter || `https://opencollective.com/${slug}`;
    if(position === users.length) {
      redirectUrl = `https://opencollective.com/${slug}/sponsor`;
    }
    
    res.redirect(redirectUrl);      
  }
};