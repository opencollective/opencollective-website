export function apply(req, res, next) {
  if (!req.group.settings.HostId) return res.sendStatus(404);
  next();
}

export default {
  apply
};