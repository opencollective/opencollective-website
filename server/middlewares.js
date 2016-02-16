import config from 'config';
import api from './lib/api';
import expressSession from 'express-session';
import ua from 'universal-analytics';

/**
 * Fetch users by slug
 */
const fetchUsers = (req, res, next) => {
  api
    .get(`/groups/${req.params.slug}/users`)
    .then((users) => {
      req.users = users;
    })
    .then(next);
}

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
      secure: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'),
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

export default { fetchGroupBySlug, fetchUsers, ga}
