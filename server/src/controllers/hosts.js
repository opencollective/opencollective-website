export function apply(req, res, next) {
  if (!req.collective.settings.apply) return res.sendStatus(404);
  next();
}

export default {
  apply
};