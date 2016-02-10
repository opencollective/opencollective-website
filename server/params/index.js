import api from '../api';

/**
 * Group slug
 */

const slug = (req, res, next) => {
  api.get(`groups/${req.params.slug.toLowerCase()}/`)
    .then(group => {
      req.group = group;
      next();
    })
    .catch(next);
};

export default { slug };