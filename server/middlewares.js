import config from 'config';
import api from './lib/api';
import expressSession from 'express-session';
import ua from 'universal-analytics';

import filterCollection from '../frontend/src/lib/filter_collection';

/**
 * Fetch users by slug
 */
const fetchUsers = (options) => {
  return (req, res, next) => {
    api
      .get(`/groups/${req.params.slug}/users`, options)
      .then((users) => {
        req.users = users;
      })
      .then(next);
  }
};

/**
 * Fetch group by slug
 */
const fetchGroupBySlug = (req, res, next) => {
  api
    .get(`/groups/${req.params.slug.toLowerCase()}/`)
    .then(group => {
      req.group = group;
      next();
    })
    .catch(next);
};

/**
 * Fetch the transactions server side
 */
const fetchSubscriptionsByUserWithToken = (req, res, next) => {

  if (!req.params.token) {
    req.jwtInvalid = true;
    return next();
  }

  api.get('/subscriptions', {headers: {
      Authorization: `Bearer ${req.params.token}`
    }})
    .then(subscriptions => {
      req.subscriptions = subscriptions;
      next();
    })
    .catch((response) => {
      const error = response.json.error;
      if (error.type === 'jwt_expired') {
        req.jwtExpired = true; // we will display the input form to renew the jwt
        return next();
      } else if (error.type === 'unauthorized') {
        req.jwtInvalid = true;
        return next();
      }
      next(error);
    });
};

/*
 * Extract github username from token
 */
const extractGithubUsernameFromToken = (req, res, next) => {
  if (!req.params.token) {
    return next();
  }

  api.get('/connected-accounts/github/verify', {headers: {
      Authorization: `Bearer ${req.params.token}`
    }})
    .then(res => {
      req.connectedAccount = {
        username: res.username,
        id: res.connectedAccountId,
        provider: res.provider
      };
      next();
    })
    .catch((response) => {
      const error = response.json.error;
      next(error);
    });
};

/**
 * Fetch leaderboard
 */
const fetchLeaderboard = (req, res, next) => {
    api
      .get(`/leaderboard`)
      .then((groups) => {
        req.leaderboard = groups;
      })
      .then(next);
};

/**
 *
 */
const cache = (maxAge = 60) => {
  return (req, res, next) => {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    next();
  }
};

/**
 * Google Analytics middleware
 * This exposes the following methods to record events:
 * req.ga.pageview();
 * req.ga.event(EventCategory, EventName, EventLabel, EventValue);
 */
const ga = (req, res, next) => {

  // We generate a session to be able to keep track of requests coming from the same visitor
  const session = expressSession({
    httpOnly: true,
    secret: 'b4;jP(cUqPaf8TuG@U',
    cookie: {
      secure: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
      maxAge: 60*60*24*30*1000 // 1 month
    }
  });

  const mw = ua.middleware(config.GoogleAnalytics.account, {cookieName: '_ga'});

  session(req, res, () => {
    mw(req, res, next);
    req.ga = {
      pageview: () => req.visitor.pageview(req.url).send(),
      event: (EventCategory, EventName, EventLabel, EventValue) => req.visitor.event(EventCategory, EventName, EventLabel, EventValue, {p: req.url}).send()
    }
  });
};

const addMeta = (req, res, next) => {
  const group = req.group;

  if (group.mission) {
    req.meta = {
      url: group.publicUrl,
      title: `Join ${group.name}'s open collective`,
      description: `${group.name} is collecting funds to continue their activities. Chip in!`,
      image: group.image || group.logo,
      twitter: `@${group.twitterHandle}`,
    };
  } else if (group.username) {
    const user = req.group;
    var description = '';

    if(user.groups.length > 0) {
      const belongsTo = filterCollection(user.groups, { role: 'MEMBER' });
      const backing = filterCollection(user.groups, { role: 'BACKER' });

      if(belongsTo.length > 0) {
        description += `a member of ${belongsTo.length} collectives`;
      }
      if(backing.length > 0) {
        if(description.length > 0) description += ' and ';
        description += `supporting ${backing.length} collectives`;
      }

      user.groups.sort((a, b) => (b.members - a.members));
      description += ' including ';
      const includingGroups = user.groups.slice(0,3).map((g) => g.name);
      description += includingGroups.join(', ');
    }


    req.meta = {
      url: `${config.host.website}/${user.username}`,
      title: `${user.name} is on OpenCollective`,
      description: `${user.name} is ${description}`,
      twitter: `@${user.twitterHandle}`,
      image: user.avatar
    };
  } else {
    req.meta = {};
  }

  next();
};

const addTitle = (title) => {
  return (req, res, next) => {
    req.meta = {
      title: title
    }
    next();
  }
}

const handleUncaughtError = (error, req, res, next) => {
    if (error.name === 'FetchError') {
      if (error.code === 'ECONNREFUSED') {
        console.error('API Server is down')
      } else {
        console.error('There was an error fetching from api')
      }
      console.log('Error', error);
      console.log('Error stack', error.stack);
      
      res
      .status(500)
      .render('pages/error', {
        layout: false,
        message: process.env.NODE_ENV === 'production' ? 'We couldn\'t find that page :(' : `Error ${error.code}: ${error.message}`,
        stack: process.env.NODE_ENV === 'production' ? '' : error.stack,
        options: {
          showGA: config.GoogleAnalytics.active
        }
      }); 
    } else {
      next(error)
    }
};

export default {
  addMeta,
  addTitle,
  cache,
  fetchGroupBySlug,
  fetchSubscriptionsByUserWithToken,
  extractGithubUsernameFromToken,
  fetchUsers,
  fetchLeaderboard,
  ga,
  handleUncaughtError
}
