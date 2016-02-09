import { get } from '../../lib/api';

/**
 * Group slug
 */

const slug = (req, res, next) => {
  get(`groups/${req.params.slug.toLowerCase()}/`)
    .then(group => {
      req.group = group;
      next();
    })
    .catch(next);
};

export default { slug };