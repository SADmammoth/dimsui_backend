export default function userIdFilter(req, res, next) {
  if (req.user.role === 'member' && req.user.userId != req.params.userId) {
    res.status(401).send();
  }

  next();
}
