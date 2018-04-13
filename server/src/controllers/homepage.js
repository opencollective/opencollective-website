import api from '../lib/api';

export default (req, res, next) => {

  api
    .get(`/homepage`, { cache: 60 * 60 * 6 }) // cache for six hours; increasing to see if it helps with downtime
    .then(homepage => {
      req.homepage = homepage;
    })
    .then(next)
    .catch(next);
}
