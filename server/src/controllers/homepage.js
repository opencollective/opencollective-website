import api from '../lib/api';
import { fetchProfileBySlug, addMeta } from '../middlewares';

export default (req, res, next) => {

  /**
   * If the host is brusselstogether.org, the homepage should be the supercollective /brusselstogether
   */
  if (req.host.match(/brusselstogether\.org/i)) {
    req.params.slug = 'brusselstogether';
    return fetchProfileBySlug(req, res, () => addMeta(req, res, next));
  }

  api
    .get(`/homepage`, { cache: 60 * 60 }) // cache for one hour
    .then(homepage => {
      req.homepage = homepage;
    })
    .then(next)
    .catch(next);
}
