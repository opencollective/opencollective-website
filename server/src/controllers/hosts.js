export function apply(req, res, next) {
  if (!req.collective.settings.HostId) return res.sendStatus(404);
  next();
}

export default {
  apply
};