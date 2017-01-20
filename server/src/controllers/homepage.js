import api from '../lib/api';

export default (req, res, next) => {

  api
    .get(`/homepage`, { cache: 60 * 60 }) // cache for one hour
    .then(homepage => {
      req.homepage = homepage;
    })
    .then(next)
    .catch(next);
}
