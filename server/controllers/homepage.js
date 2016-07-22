import api from '../lib/api';

module.exports = (req, res, next) => {
  api
    .get(`/homepage`)
    .then(homepage => {
      req.homepage = homepage;
    })
    .then(next)
    .catch(next);
}