import api from './lib/api';

/**
 * Fetch users by slug
 */
const fetchUsers = (req, res, next) => {
  api
    .get(`/groups/${req.params.slug}/users`)
    .then((users) => {
      req.users = users;
    })
    .then(next);
}

/**
 * Fetch group by slug
 */
const fetchGroupBySlug = (req, res, next) => {
  api
    .get(`/groups/${req.params.slug.toLowerCase()}/`)
    .then(group => {
      req.group = group;
      next();
    })
    .catch(next);
};

export default { fetchGroupBySlug, fetchUsers}