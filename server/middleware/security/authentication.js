import api from '../../lib/api';
import config from 'config';
import passport from 'passport';

export default {

  authenticateService: (req, res, next) => {
    const service = req.params.service;
    passport.authenticate(req.params.service, {
      // callback URL base must match the one configured in the service, so slug (the variable part) must come last
      callbackURL: `${config.host.website}/auth/${service}/callback/`,
      // TODO set proper scope
      scope: [ 'user:email' ]
    })(req, res, next);
  },

  authenticateServiceCallback: (req, res, next) => {
    const service = req.params.service;
    passport.authenticate(service, (err, accessToken, profile) => {
      if (err) {
        return next(err);
      }
      if (!accessToken) {
        return res.redirect(`connect/${service}`);
      }
      // for now, just use the first email. Github can give us more than 1
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      api.post(`/connected-accounts/${service}`, JSON.stringify({ accessToken, clientId: profile.username, email }))
        .then((req) => {
          return res.redirect(`/github/apply/${req.token}`);
        })
        .catch(apiErr => next(apiErr));
    })(req, res, next);
  }
};
