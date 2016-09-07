import api from '../lib/api';

export default (req, res, next) => {
  api
    .get(`/homepage`)
    .then(homepage => {
      req.homepage = homepage;
    })
    .then(next)
    .catch(next);
}
