import api from '../lib/api';

module.exports = (req, res, next) => {
  api
    .get(`/users/${req.params.username}?profile=true`)
    .then(profile => {
      req.profile = profile;
    })
    .then(next);
}