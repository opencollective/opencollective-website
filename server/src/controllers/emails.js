import api from '../lib/api';

export function approve(req, res, next) {
  const { messageId, approver } = req.query;
  api
    .get(`/services/email/approve?messageId=${messageId}&approver=${approver}`)
    .then(next)
    .catch(next);
}

export function unsubscribe(req, res, next) {
  const { email, slug, type, token } = req.query;
  api
    .get(`/services/email/unsubscribe/${email}/${slug}/${type}/${token}`)
    .then(next)
    .catch(next);
}

export default {
  approve,
  unsubscribe
}