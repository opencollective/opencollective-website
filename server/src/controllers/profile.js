import api from '../lib/api';

export default (req, res, next) => {
  api
    .get(`/profile/${req.params.slug.toLowerCase()}`)
    .then(profile => {
      req.group = profile;
    })
    .then(next)
    .catch(next);
}
