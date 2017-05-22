import config from 'config';
import api from './lib/api';
import expressSession from 'express-session';
import ua from 'universal-analytics';
import filterCollection from '../../frontend/src/lib/filter_collection';
import { filterUsers } from './lib/utils';
import _ from 'lodash';

/**
 * Fetch users by slug
 */
const fetchUsers = (options = {}) => {
  options.cache = options.cache || 300; // default cache for api requests to fetch users: 5mn

  return (req, res, next) => {

    const requireActive = (typeof options.requireActive === 'boolean') ? options.requireActive : req.query.requireActive !== 'false'; // by default, we skip inactive users
    const filters = {
      tier: req.params.tier,
      exclude: req.query.exclude,
      requireAvatar: (typeof options.requireAvatar === 'boolean') ? options.requireAvatar : req.query.requireAvatar !== 'false' // by default, we skip users without avatar
    };

    let fetchUsers;
    switch (filters.tier) {
      case 'contributors':
        fetchUsers = api.get(`/groups/${req.params.slug.toLowerCase()}/`, { cache: 60 * 60 })
                        .then(group => group.data.githubContributors);
        break;
      default:
        options.cache = 300;
        fetchUsers = api.get(`/groups/${req.params.slug.toLowerCase()}/users${requireActive ? '?filter=active' : ''}`, options)
                        .then(users => _.filter(users, (u) => {
                          if (filters.tier) {
                            return u.tier === filters.tier;
                          } else {
                            return true;
                          }
                        }));
        break;
    }

    fetchUsers
      .then((users) => {
        req.users = filterUsers(users, filters);
      })
      .then(next)
      .catch(next); // make sure we return 404 if group doesn't exist
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
      req.collective = group;
      next();
    })
    .catch(next);
};

/**
 * Fetch profile by slug (group or user profile)
 */
const fetchProfileBySlug = (req, res, next) => {
  api
    .get(`/profile/${req.params.slug.toLowerCase()}`)
    .then(profile => {
      if (profile.username) {
        req.user = profile;
      } else {
        req.collective = profile;
      }
      next();
    })
    .catch(next);
}

/**
 * Fetch transaction by UUID
 */
const fetchTransactionByUUID = (req, res, next) => {
  api
    .get(`/transactions/${req.params.transactionuuid}`)
    .then(transaction => {
      req.transaction = transaction;
      next();
    })
    .catch(next);
}

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
      const { error } = response.json;
      next(error);
    });
};

/**
 *
 */
const maxAge = (maxAge = 60) => {
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
  const { collective, user } = req;

  req.meta = {};
  if (collective) {
    req.meta = {
      url: collective.publicUrl,
      title: `${collective.name} is on Open Collective`,
      description: `${collective.mission}`,
      image: collective.image || collective.logo,
      twitter: `@${collective.twitterHandle}`,
    };
  } else {
    let description = '';

    if (user.groups.length > 0) {
      const belongsTo = filterCollection(user.groups, { role: 'MEMBER' });
      const backing = filterCollection(user.groups, { role: 'BACKER' });

      if (belongsTo.length > 0) {
        description += `a member of ${belongsTo.length} collectives`;
      }
      if (backing.length > 0) {
        if (description.length > 0) description += ' and ';
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
  }

  next();
};

const addTitle = (title) => {
  return (req, res, next) => {
    req.meta = {
      title
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
  maxAge,
  fetchGroupBySlug,
  fetchProfileBySlug,
  fetchTransactionByUUID,
  extractGithubUsernameFromToken,
  fetchUsers,
  ga,
  handleUncaughtError
}
