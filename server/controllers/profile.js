import api from '../lib/api';

module.exports = (req, res, next) => {
  api
    .get(`/profile/${req.params.slug.toLowerCase()}`)
    .then(profile => {
      req.group = profile;
    })
    .then(next)
    .catch(next);
}