import api from '../lib/api';

export default (req, res, next) => {
  const { email, slug, type, token } = req.query;
  api
    .get(`/services/email/unsubscribe/${email}/${slug}/${type}/${token}`)
    .then(next)
    .catch(next);
}
