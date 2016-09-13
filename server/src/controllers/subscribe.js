import api from '../lib/api';

export default (req, res, next) => {
  const { messageId, approver } = req.query;
  api
    .get(`/services/email/approve?messageId=${messageId}&approver=${approver}`)
    .then(next)
    .catch(next);
}
